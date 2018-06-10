/**
 * BLESerial3 の UUID
 * @type {string}
 */
const SERVICE_UUID = "FEED0001-C497-4476-A7ED-727DE7648AB1";

/**
 * RX(Notify) UUID
 * @type {string}
 */
const RX_NOTIFY_CHARACTERISTIC_UUID = "FEEDAA03-C497-4476-A7ED-727DE7648AB1";
/**
 * TX(WRITE) UUID
 * @type {string}
 */
const TX_WRITE_CHARACTERISTIC_UUID = "FEEDAA02-C497-4476-A7ED-727DE7648AB1";

/**
 * Rxのキャラクタリスティックです。
 */
let RxCharacteristic;

/**
 * Txのキャラクタリスティックです。
 */
let TxCharacteristic;

/**
 * BLEに接続するボタンです。
 */
let connectButton;

/**
 * Rx・Txを表示するDOMです。
 */
let mainView;

/**
 * Rxを表示するDOMです。
 */
let RxText;

/**
 * Txを表示するDOMです。
 */
let TxText;

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
  RxText = document.querySelector("#Rx-text");
  TxText = document.querySelector("#Tx-text");

  loading = document.querySelector("#loading");
}

/**
 * Web Bluetooth APIでBLEデバイスに接続します。
 */
function connectBLE() {
  /* loading表示 */
  loading.className = "show";

  navigator.bluetooth.requestDevice({
    filters: [
      {
        services: [
          SERVICE_UUID
        ]
      }
    ]
  })
    .then(device => {
      console.log("デバイスを選択しました。接続します。");
      console.log("デバイス名 : " + device.name);
      console.log("ID : " + device.id);

      /* 選択したデバイスに接続 */
      return device.gatt.connect();
    })
    .then(server => {
      console.log("デバイスへの接続に成功しました。サービスを取得します。");

      /* UUIDに合致するサービス(機能)を取得 */
      return server.getPrimaryService(SERVICE_UUID);
    })
    .then(service => {
      console.log("サービスの取得に成功しました。キャラクタリスティックを取得します。");

      /* UUIDに合致するキャラクタリスティック(サービスが扱うデータ)を取得 */
      return Promise.all([
        service.getCharacteristic(RX_NOTIFY_CHARACTERISTIC_UUID),
        service.getCharacteristic(TX_WRITE_CHARACTERISTIC_UUID)
      ]);
    })
    .then(characteristic => {
      RxCharacteristic = characteristic[0];
      TxCharacteristic = characteristic[1];

      console.log("BLE接続が完了しました。");

      /* センサーの値を読み込みます。*/
      loadSensorValue();

    })
    .catch(error => {
      console.log("Error : " + error);

      /* loading非表示 */
      loading.className = "hide";
    });
}

/**
 * センサーの値を読み込みます。
 */
function loadSensorValue() {
  /* 1秒ごとにセンサーの値を取得 */
  setInterval(function () {
    let Rx;
    let Tx;

    /* Rxの値を読み込む */
    RxCharacteristic.readValue()
      .then(value => {
        /* Rxを取得 */
        Rx = value.getUint8(0);

        /* Txの値を読み込む */
        return TxCharacteristic.readValue();
      })
      .then(value => {
        /* Txを取得 */
        Tx = value.getUint8(0);

        /* Rx・Txの表示を更新 */
        RxText.innerHTML = Rx;
        TxText.innerHTML = Tx;

        console.log("Rx(Notify) : " + Rx + " | Tx : " + Tx + );

        /* Tx・Rxを表示 */
        showMainView();
      })
      .catch(error => {
        console.log("Error : " + error);
      });

  }, 1000);
}

/**
 * Tx・Rxを表示します。
 */
function showMainView() {
  /* 接続ボタン */
  connectButton.className = "hide";

  /* loading非表示 */
  loading.className = "hide";

  /* Rx・Tx表示 */
  mainView.className = "show";
}

window.addEventListener("load", init);