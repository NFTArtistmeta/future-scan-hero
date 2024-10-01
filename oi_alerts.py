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

trading_pairs = [
    'BTCUSDT', 'ETHUSDT', 'BCHUSDT', 'ETCUSDT', 'LTCUSDT', 'XRPUSDT',
    'FETUSDT', 'BNBUSDT', 'ALGOUSDT', 'DOGEUSDT', 'CKBUSDT', 'QTUMUSDT',
    'COMPUSDT', 'XTZUSDT', 'ADAUSDT', 'LINKUSDT', 'DOTUSDT', 'UNIUSDT',
    'FILUSDT', 'EOSUSDT', 'TRXUSDT', 'GMTUSDT', 'APEUSDT', 'KNCUSDT',
    'GTCUSDT', 'XLMUSDT', 'XMRUSDT', 'VETUSDT', 'NEOUSDT', 'THETAUSDT',
    'ZILUSDT', 'ZRXUSDT', 'KAVAUSDT', 'BANDUSDT', 'MKRUSDT', 'SNXUSDT',
    'BALUSDT', 'CRVUSDT', 'TRBUSDT', 'SUSHIUSDT', 'EGLDUSDT', 'SOLUSDT',
    'STORJUSDT', 'AVAXUSDT', 'FTMUSDT', 'FLMUSDT', 'KSMUSDT', 'NEARUSDT',
    'AAVEUSDT', 'RSRUSDT', 'LRCUSDT', 'BELUSDT', 'AXSUSDT', 'GRTUSDT',
    '1INCHUSDT', 'CHZUSDT', 'SANDUSDT', 'LITUSDT', 'UNFIUSDT', 'REEFUSDT',
    'RVNUSDT', 'MANAUSDT', 'OGNUSDT', 'NKNUSDT', '1000SHIBUSDT', 'ICPUSDT',
    'BAKEUSDT', 'TLMUSDT', 'C98USDT', 'MASKUSDT', 'DYDXUSDT', 'GALAUSDT',
    'ARUSDT', 'ARPUSDT', 'ENSUSDT', 'PEOPLEUSDT', 'ROSEUSDT', 'ATOMUSDT',
    'JASMYUSDT', 'DARUSDT', 'OPUSDT', '1000LUNCUSDT', 'LUNA2USDT', 'FLOWUSDT',
    'STGUSDT', 'APTUSDT', 'QNTUSDT', 'INJUSDT', 'LDOUSDT', 'HOOKUSDT',
    'MAGICUSDT', 'STXUSDT', 'ACHUSDT', 'SSVUSDT', 'USDCUSDT', 'FLOKIUSDT',
    'ARBUSDT', 'IDUSDT', 'JOEUSDT', 'AMBUSDT', 'LEVERUSDT', 'BLURUSDT',
    'SUIUSDT', '1000PEPEUSDT', 'ORDIUSDT', 'WOOUSDT', 'WLDUSDT', 'PENDLEUSDT',
    'AGLDUSDT', 'ARKMUSDT', 'HIGHUSDT'
]

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
    print(f"Monitoring {len(trading_pairs)} trading pairs")
    previous_oi = {pair: None for pair in trading_pairs}
    
    while True:
        for pair in trading_pairs:
            current_oi = fetch_oi_data(pair)
            if detect_oi_change(pair, previous_oi[pair], current_oi):
                previous_oi[pair] = current_oi
        
        time.sleep(60)  # Wait for 1 minute before next check

if __name__ == "__main__":
    main()