import React from "react";
import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";


function CanteenScanner(){

     useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText) => {
        // QR scan hone ke baad
        console.log("QR Scanned:", decodedText);
        window.location.href = decodedText; // redirect to URL in QR
      },
      (error) => {
        console.warn(error);
      }
    );

    return () => scanner.clear();
  }, []);
   

    return(
        <div>
            <h1>Qr Code Scanner</h1>
            <div id="qr-reader"></div>
        </div>
         
    );
}

export default CanteenScanner;