import ccxt
import time
from datetime import datetime

# Initialize the exchange (Binance)
exchange = ccxt.binance({
    'enableRateLimit': True,
    'options': {
        'defaultType': 'future'  # Use futures market
    }
})

def fetch_all_perpetual_pairs():
    try:
        markets = exchange.load_markets()
        perpetual_pairs = [symbol for symbol, market in markets.items() if market['future'] and market['linear']]
        print(f"Fetched {len(perpetual_pairs)} perpetual contract pairs")
        return perpetual_pairs
    except Exception as e:
        print(f"Error fetching perpetual pairs: {e}")
        return []

def fetch_oi_data(symbol):
    try:
        oi = exchange.fetch_open_interest(symbol)
        return oi['openInterestAmount']
    except Exception as e:
        print(f"Error fetching OI data for {symbol}: {e}")
        return None

def detect_oi_change(symbol, previous_oi, current_oi, threshold=0.05):
    if previous_oi is None or current_oi is None:
        return False
    
    change = (current_oi - previous_oi) / previous_oi
    if abs(change) >= threshold:
        direction = "increase" if change > 0 else "decrease"
        print(f"[{datetime.now()}] Alert: {symbol} OI {direction} by {abs(change)*100:.2f}%")
        return True
    return False

def main():
    pairs = fetch_all_perpetual_pairs()
    print(f"Monitoring {len(pairs)} perpetual contract pairs")
    previous_oi = {pair: None for pair in pairs}
    
    while True:
        for pair in pairs:
            current_oi = fetch_oi_data(pair)
            if detect_oi_change(pair, previous_oi[pair], current_oi):
                previous_oi[pair] = current_oi
        
        time.sleep(60)  # Wait for 1 minute before next check

if __name__ == "__main__":
    main()