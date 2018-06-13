/**
 * サービスのUUIDです。
 * @type {string}
 */
const SERVICE_UUID = "feed0001-c497-4476-a7ed-727de7648ab1";

/**
 * キャラクタリスティックのUUIDです。
 * @type {string}
 */
const RX_CHARACTERISTIC_UUID = "feedaa03-c497-4476-a7ed-727de7648ab1";
const TX_CHARACTERISTIC_UUID = "feedaa02-c497-4476-a7ed-727de7648ab1";

/**
 * 湿度のキャラクタリスティックです。
 */
let humidityCharacteristic;

/**
 * 温度のキャラクタリスティックです。
 */
let temperatureCharacteristic;

/**
 * BLEに接続するボタンです。
 */
let connectButton;

/**
 * 湿度・温度を表示するDOMです。
 */
let mainView;

/**
 * 湿度を表示するDOMです。
 */
let humidityText;

/**
 * 温度を表示するDOMです。
 */
let temperatureText;

/**
 * ローディングボタンです。
 */
let loading;

/**
 * 初期化処理です。
 */
function init() {
  connectButton = document.querySelector("#ble-connect-button");
  connectButton.addEventListener("click", connectBLE);

  mainView = document.querySelector("#main-view");
  humidityText = document.querySelector("#humidity-text");
  temperatureText = document.querySelector("#temperature-text");

  loading = document.querySelector("#loading");
}

function toHex(v) {
    return '0x' + (('0000' + v.toString(16).toUpperCase()).substr(-4));
}

/**
 * Web Bluetooth APIでBLEデバイスに接続します。
 */
function connectBLE() {
  // loading表示
  loading.className = "show";

  navigator.bluetooth.requestDevice({
    filters: [
      { services: [SERVICE_UUID] }
    ]
  })
    .then(device => {
      console.log("デバイスを選択しました。接続します。");
      console.log("デバイス名 : " + device.name);
      console.log("ID : " + device.id);

      // 選択したデバイスに接続
      return device.gatt.connect();
    })
    .then(server => {
      console.log("デバイスへの接続に成功しました。サービスを取得します。");

      // UUIDに合致するサービス(機能)を取得
      return server.getPrimaryService(SERVICE_UUID);
    })
    .then(service => {
      console.log("サービスの取得に成功しました。キャラクタリスティックを取得します。");

      // UUIDに合致するキャラクタリスティック(サービスが扱うデータ)を取得
      return Promise.all([
        service.getCharacteristic(RX_CHARACTERISTIC_UUID),
        service.getCharacteristic(TX_CHARACTERISTIC_UUID)
      ]);
    })
    .then(characteristic => {
      humidityCharacteristic = characteristic[0];
      temperatureCharacteristic = characteristic[1];

      console.log("BLE接続が完了しました。");

      // センサーの値を読み込みます。
      loadSensorValue();

    })
      .catch(error => {
        console.log("Error : " + error);

      // loading非表示
      loading.className = "hide";
    });
}

/**
 * センサーの値を読み込みます。
 */
function loadSensorValue() {
  // 1秒ごとにセンサーの値を取得
  setInterval(function () {
    let humidity;
    let temperature;

    console.log("BLEから読み込みを開始します");
    // 湿度の値を読み込む
    humidityCharacteristic.readValue()
      .then(value => {
        console.log("humidity を取得します");
        // 湿度を取得
        humidity = value.getUint8(0);

        // 温度の値を読み込む
        return temperatureCharacteristic.readValue();
      })
      .then(value => {
        console.log("temperature を取得します");
        // 温度を取得
        temperature = value.getUint8(0);

        // 湿度・温度の表示を更新
        console.log("取得が完了しました を取得します");
        humidityText.innerHTML = humidity;
        temperatureText.innerHTML = temperature;

        console.log("RX : " + humidity + " | TX : " + temperature + "");

        // 温度・湿度を表示
        showMainView();
	    var sendarray = new Uint8Array( humidity+1 );
        
        temperatureCharacteristic.writeValue(sendarray);  
      })
      .catch(error => {
        console.log("Error : " + error);
      });

  }, 1000);
}

/**
 * 温度・湿度を表示します。
 */
function showMainView() {
   console.log("MainViewを表示します");
  // 接続ボタン
  connectButton.className = "hide";

  // loading非表示
  loading.className = "hide";

  // 湿度・温度表示
  mainView.className = "show";
}

function sendData() {
    alert( "send stand by");
	var sendarray = new Uint8Array( demo_form.send_data.value );
    temperatureCharacteristic.writeValue( sendarray );
    alert( "send data comp val:" + demo_form.send_data.value + "");
    loadSensorValue();
    alert( "reloading");
}
window.addEventListener("load", init);