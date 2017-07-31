import Coin from './Coin';
import CoinApi from './CoinApi';
import ElementHandler from './ElementHandler';

let ca = new CoinApi();
let elementHandler = new ElementHandler(ca);
let c = new Coin("KMD", 10, 5, "active", ca);

let coins = {};

let ctx = document.getElementById('goalChart').getContext('2d');

