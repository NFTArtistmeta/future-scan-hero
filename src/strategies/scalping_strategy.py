import ccxt
import numpy as np
import pandas as pd
from datetime import datetime
import time
import asyncio

class ScalpingStrategy:
    def __init__(self, symbol, timeframe='1m', ema_short=10, ema_long=20, rsi_period=14, rsi_overbought=70, rsi_oversold=30):
        self.exchange = ccxt.binance({
            'enableRateLimit': True,
            'options': {
                'defaultType': 'future'
            }
        })
        self.symbol = symbol
        self.timeframe = timeframe
        self.ema_short = ema_short
        self.ema_long = ema_long
        self.rsi_period = rsi_period
        self.rsi_overbought = rsi_overbought
        self.rsi_oversold = rsi_oversold

    async def fetch_ohlcv(self):
        try:
            ohlcv = await self.exchange.fetch_ohlcv(self.symbol, self.timeframe, limit=100)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            return df
        except Exception as e:
            print(f"Error fetching data for {self.symbol}: {e}")
            return None

    def calculate_indicators(self, df):
        df['ema_short'] = df['close'].ewm(span=self.ema_short, adjust=False).mean()
        df['ema_long'] = df['close'].ewm(span=self.ema_long, adjust=False).mean()
        
        delta = df['close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=self.rsi_period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=self.rsi_period).mean()
        rs = gain / loss
        df['rsi'] = 100 - (100 / (1 + rs))
        
        return df

    def generate_signals(self, df):
        df['signal'] = np.where((df['ema_short'] > df['ema_long']) & (df['rsi'] < self.rsi_oversold), 1, 0)
        df['signal'] = np.where((df['ema_short'] < df['ema_long']) & (df['rsi'] > self.rsi_overbought), -1, df['signal'])
        return df

    def execute_trade(self, signal):
        if signal == 1:
            print(f"[{datetime.now()}] Opening long position for {self.symbol}")
            # Implement your long position logic here
        elif signal == -1:
            print(f"[{datetime.now()}] Opening short position for {self.symbol}")
            # Implement your short position logic here

    async def run(self):
        while True:
            try:
                df = await self.fetch_ohlcv()
                if df is not None:
                    df = self.calculate_indicators(df)
                    df = self.generate_signals(df)
                    
                    last_row = df.iloc[-1]
                    if last_row['signal'] != 0:
                        self.execute_trade(last_row['signal'])
                
                await asyncio.sleep(60)  # Wait for 1 minute before next iteration
            except Exception as e:
                print(f"An error occurred for {self.symbol}: {e}")
                await asyncio.sleep(60)  # Wait for 1 minute before retrying

async def run_strategies(trading_pairs):
    strategies = [ScalpingStrategy(symbol) for symbol in trading_pairs]
    await asyncio.gather(*[strategy.run() for strategy in strategies])

if __name__ == "__main__":
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
    
    asyncio.run(run_strategies(trading_pairs))