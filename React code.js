import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { fromUser, fromCrypto } from 'store/selectors';
import { cryptoActions } from 'store/actions';
import { Tooltip } from 'components';

const PageWrapper = styled.div`
  font-size: 16px;
  .wallet-value {
    margin-bottom: 20px;
    span {
      display: inline-block;
      line-height: 40px;
      font-size: 20px;
      font-family: MuliBold;
      color: #2D3560;
    }
  }
  .crypto-row {
    display: flex;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 10px;
    padding: 5px 20px;
    margin-bottom: 15px;
    overflow: hidden;
    height: 60px;
    justify-content: flex-start;
    .coin { display: flex }
    .crypto-icon {
      img {
        margin-top: 10px;
        width: 30px;
        height: 30px;
      }
    }
    .crypto-name {
      margin-left: 20px;
      line-height: 50px;
      color: rgba(45, 53, 96, 0.8);
      font-size: 18px;
      font-family: MuliBold;
      width: 100%;
      min-width: 100px;
      max-width: 160px;
    }
    .crypto-balance, .crypto-price, .crypto-24change {
      margin-top: 5px;
      width: calc(50% - 140px);
      p, span {
        line-height: 20px;
        font-family: MuliLight;
        font-size: 14px;
        color: rgba(45, 53, 96, 0.8);
        text-align: center;
        display: block;
        width: 100%;
        min-width: 90px;
      }
      span {
        font-family: MuliBold;
      }
    }
    .crypto-buttons {
      margin-left: 70px;
      button {
        display: block;
        width: 90px;
        height: 22px;
        border-radius: 4px;
        border: 0;
        cursor: pointer;
        color: #fff;
        font-size: 12px;
        font-family: MuliBold;
        &:first-child {
          margin-bottom: 5px;
          background: rgb(0, 217, 130);
        }
        &:last-child {
          background: rgb(132, 175, 247);
        }
      }
    }
  }
  .link-sugestion {
    margin-top: 50px;
    margin-bottom: 100px;
    text-align: center;
    span {
      display: inline-block;
      line-height: 40px;
      font-size: 18px;
      font-family: MuliBold;
      color: #2D3560;
      i {
        color: rgba(230, 230, 230, 1);
      }
    }
    button {
      height: 40px;
      width: 160px;
      font-size: 16px;
      font-family: MuliBold;
      background: #39BAFF;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      margin-left: 55px;
      color: #fff;
    }
  }
  @media (max-width: 1200px) {
    .crypto-row {
      justify-content: space-between;
      .crypto-buttons {
        margin: 0;
        float: none;
      }
    }
  }
  @media (max-width: 800px) {
    .crypto-row {
      display: block;
      height: auto;
      text-align: center;
      .coin {
        width: 100%;
        justify-content: center;
        .crypto-name {
          text-align: left;
          width: auto;
        }
      }
      .crypto-balance, .crypto-price, .crypto-24change {
        width: auto;
        display: inline-flex;
        flex-direction: column;
        margin: 5px 0;
        padding: 0 10px;
        border-right: 1px solid #dbddeb;
        p, span { font-size: 16px }
      }
      .crypto-price {
        /* remove this when 24-change is shown */
        border: none;
      }
      .crypto-24change { border: none }
      .crypto-buttons {
        display: flex;
        justify-content: center;
        margin: 20px 0;
        button {
          width: 120px;
          height: 30px;
          &:first-child { margin: 0 20px 0 0 }
        }
      }
    }
    .link-sugestion {
      button {
        display: block;
        margin: 20px auto;
      }
    }
  }
  @media (max-width: 600px) {
    .link-sugestion {
      span { font-size: 15px }
    }
  }
  @media (max-width: 500px) {
    .crypto-row {
      .coin { justify-content: flex-start }
      .crypto-balance, .crypto-price, .crypto-24change {
        display: flex;
        border: none;
        flex-direction: row;
        justify-content: flex-start;
        padding: 0;
        p, span {
          text-align: left;
        }
        p { margin-right: 10px }
      }
      .crypto-buttons {
        justify-content: flex-start;
      }
    }
  }
`;

class CryptoBalances extends React.PureComponent {
  componentDidMount() {
    this.getBalances();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.role === null && this.props.role !== null) {
      this.getBalances();
    }
  }

  getBalances = () => {
    const { role, currentUser } = this.props;
    if (this.props.role === null) {
      return;
    }
    if (role === 'admin') {
      this.props.getCompanyBalance({
        apiKey: currentUser.company.apiKey,
        apiSecret: currentUser.company.apiSecret,
      });
    } else {
      this.props.getUserBalance();
    }
  }

  handleClickDeposit = coin => {
    this.props.history.push({
      pathname: '/crypto/deposit',
      state: { coin },
    });
  }

  handleClickWithdraw = coin => {
    this.props.history.push({
      pathname: '/crypto/withdraw',
      state: { coin },
    });
  }

  render() {
    const { userBalances, companyBalances, role } = this.props;

    const balances = role === 'admin' ? companyBalances : userBalances;

    const balanceTable = balances.map((item, index) => {
      const currencyIcon = ``;
      const usdAmount = Number(item.price * item.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      const change24 = Math.round(Math.random() * 100);
      return (
        <div className="crypto-row" key={index}>
          <div className="coin">
            <div className="crypto-icon">
              <img src={currencyIcon} alt="" />
            </div>
            <div className="crypto-name">{item.cryptocurrency.long}</div>
          </div>
          <div className="crypto-balance">
            <p>Balance</p>
            <span>
              {item.amount.toFixed(5)} {item.cryptocurrency.short}
            </span>
          </div>
          <div className="crypto-price">
            <p>Current Price</p>
            <span>{usdAmount}</span>
          </div>
          <div className="crypto-buttons">
            <button type="button" className="button-deposit" onClick={() => { this.handleClickDeposit(item.cryptocurrency.short); }}>Deposit</button>
            <button type="button" className="button-withdraw" onClick={() => { this.handleClickWithdraw(item.cryptocurrency.short); }}>Withdraw</button>
          </div>
        </div>
      );
    });
    let totalBalance = 0;
    balances.forEach(item => {
      totalBalance += item.amount * item.price;
    });
    totalBalance = Number(totalBalance).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    return (
      <PageWrapper>
        <div className="wallet-value">
          <span>{`Wallet Value: ${totalBalance}`}</span>
        </div>
        <div className="balances-table">
          {balanceTable}
        </div>
        <div className="link-sugestion">
          <span>
            Link your Coinbase account for seamless transfers
            <Tooltip text="You can connect your Coinbase account to RewardStream to simply send and receive cryptocurrency. You can learn more about Coinbase and cryptocurrency on our blog." />
          </span>
          <button type="button">Link Coinbase</button>
        </div>
      </PageWrapper>
    );
  }
}

CryptoBalances.propTypes = {
  history: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  role: PropTypes.string,
  userBalances: PropTypes.array,
  companyBalances: PropTypes.array,
  getUserBalance: PropTypes.func.isRequired,
  getCompanyBalance: PropTypes.func.isRequired,
};

CryptoBalances.defaultProps = {
  currentUser: {},
  role: null,
  userBalances: [],
  companyBalances: [],
};

const mapStateToProps = state => ({
  currentUser: fromUser.currentUser(state),
  role: fromUser.role(state),
  userBalances: fromCrypto.userBalances(state),
  companyBalances: fromCrypto.companyBalances(state),
});

const mapDispatchToProps = dispatch => ({
  getUserBalance: payload => dispatch(cryptoActions.getUserBalanceRequest(payload)),
  getCompanyBalance: payload => dispatch(cryptoActions.getCompanyBalanceRequest(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CryptoBalances);
