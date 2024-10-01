import ccxt
import time
from datetime import datetime

# Initialize the exchange (using Binance as an example)
exchange = ccxt.binance({
    'enableRateLimit': True,
    'options': {
        'defaultType': 'future'  # Use futures market
    }
})

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
    symbols = ['BTC/USDT:USDT', 'ETH/USDT:USDT', 'SOL/USDT:USDT']  # Add more symbols as needed
    previous_oi = {symbol: None for symbol in symbols}
    
    while True:
        for symbol in symbols:
            current_oi = fetch_oi_data(symbol)
            if detect_oi_change(symbol, previous_oi[symbol], current_oi):
                previous_oi[symbol] = current_oi
        
        time.sleep(60)  # Wait for 1 minute before next check

if __name__ == "__main__":
    main()