/**
 * サービスのUUID
 * @type {string}
 */
const SERVICE_UUID = "feed0001-c497-4476-a7ed-727de7648ab1";

/**
 * キャラクタリスティックのUUID
 * @type {string}
 */
const RX_CHARACTERISTIC_UUID = "feedaa03-c497-4476-a7ed-727de7648ab1";
const TX_CHARACTERISTIC_UUID = "feedaa02-c497-4476-a7ed-727de7648ab1";

/**
 * 受信用のキャラクタリスティック
 */
let RxCharacteristic;

/**
 * 送信用のキャラクタリスティック
 */
let TxCharacteristic;


/**
 * BLESerial3に接続する
 */
function connectBLESerial3() {

  navigator.bluetooth.requestDevice({
    filters: [
      { services: [SERVICE_UUID] }
      ]
    })
    .then(device => {
      /* 選択したデバイスに接続 */
      return device.gatt.connect();
    })
    .then(server => {
      /* UUIDに合致するサービス(機能)を取得 */
      return server.getPrimaryService(SERVICE_UUID);
    })
    .then(service => {
      /* UUIDに合致するキャラクタリスティック(サービスが扱うデータ)を取得 */
      return Promise.all([
        service.getCharacteristic(RX_CHARACTERISTIC_UUID),
        service.getCharacteristic(TX_CHARACTERISTIC_UUID)
      ]);
    })
    .then(characteristic => {
      RxCharacteristic = characteristic[0];
      TxCharacteristic = characteristic[1];
    })
      .catch(error => {
        console.log("Error : " + error);
    });
}
/**
 * キー番号を送信する
 * その後、読み込みを行う
 */
function sendData(keynumber){
    let humidity;
    var sendarray = new Uint8Array( [keynumber] );
    TxCharacteristic.writeValue( sendarray );
    alert( "send data val:" + keynumber + "");
//    const value = RxCharacteristic.readValue();
//    let batteryLevel = value.getUint8(0);
    RxCharacteristic.readValue()
      .then(value => {
        humidity = value.getUint8(0);
        alert( "read data val:" + batteryLevel + "");
      })
      .catch(error => {
        console.log("Error : " + error);
      });

    /* RXの受信値 */
//    alert( "read data val:" + batteryLevel + "");
}
/**
 * 上ボタン押下処理
 */
function onClickUp(){
    sendData( 1 );
}
/**
 * 下ボタン押下処理
 */
function onClickLeft(){
    sendData( 2 );
}
/**
 * 左ボタン押下処理
 */
function onClickLeft(){
    sendData( 3 );
}
/**
 * 右ボタン押下処理
 */
function onClickDown(){
    sendData( 4 );
}
/**
 * 接続ボタン押下処理
 */
function onClickConnect(){
    connectBLESerial3();
}
/**
 * △ボタン押下処理
 */
function onClickSankaku(){
    sendData( 5 );
}
/**
 * □ボタン押下処理
 */
function onClickSikaku(){
    sendData( 6 );
}
/**
 * ○ボタン押下処理
 */
function onClickMaru(){
    sendData( 7 );
}
/**
 * ×ボタン押下処理
 */
function onClickBatu(){
    sendData( 8 );
}
