"use strict";(self.webpackChunkneon_timing_web_usb=self.webpackChunkneon_timing_web_usb||[]).push([[413],{9413:(t,s,e)=>{e.d(s,{ESP32C3ROM:()=>a});var i=e(5422);class a extends i.e{constructor(){super(...arguments),this.CHIP_NAME="ESP32-C3",this.IMAGE_CHIP_ID=5,this.EFUSE_BASE=1610647552,this.MAC_EFUSE_REG=this.EFUSE_BASE+68,this.UART_CLKDIV_REG=1072955412,this.UART_CLKDIV_MASK=1048575,this.UART_DATE_REG_ADDR=1610612860,this.FLASH_WRITE_SIZE=1024,this.BOOTLOADER_FLASH_OFFSET=0,this.FLASH_SIZES={"1MB":0,"2MB":16,"4MB":32,"8MB":48,"16MB":64},this.SPI_REG_BASE=1610620928,this.SPI_USR_OFFS=24,this.SPI_USR1_OFFS=28,this.SPI_USR2_OFFS=32,this.SPI_MOSI_DLEN_OFFS=36,this.SPI_MISO_DLEN_OFFS=40,this.SPI_W0_OFFS=88}async getPkgVersion(t){const s=this.EFUSE_BASE+68+12;return await t.readReg(s)>>21&7}async getChipRevision(t){const s=this.EFUSE_BASE+68+12;return(await t.readReg(s)&7<<18)>>18}async getChipDescription(t){let s;s=0===await this.getPkgVersion(t)?"ESP32-C3":"unknown ESP32-C3";return s+=" (revision "+await this.getChipRevision(t)+")",s}async getFlashCap(t){const s=this.EFUSE_BASE+68+12;return await t.readReg(s)>>27&7}async getFlashVendor(t){const s=this.EFUSE_BASE+68+16;return{1:"XMC",2:"GD",3:"FM",4:"TT",5:"ZBIT"}[await t.readReg(s)>>0&7]||""}async getChipFeatures(t){const s=["Wi-Fi","BLE"],e=await this.getFlashCap(t),i=await this.getFlashVendor(t),a={0:null,1:"Embedded Flash 4MB",2:"Embedded Flash 2MB",3:"Embedded Flash 1MB",4:"Embedded Flash 8MB"}[e],h=void 0!==a?a:"Unknown Embedded Flash";return null!==a&&s.push("".concat(h," (").concat(i,")")),s}async getCrystalFreq(t){return 40}_d2h(t){const s=(+t).toString(16);return 1===s.length?"0"+s:s}async readMac(t){let s=await t.readReg(this.MAC_EFUSE_REG);s>>>=0;let e=await t.readReg(this.MAC_EFUSE_REG+4);e=e>>>0&65535;const i=new Uint8Array(6);return i[0]=e>>8&255,i[1]=255&e,i[2]=s>>24&255,i[3]=s>>16&255,i[4]=s>>8&255,i[5]=255&s,this._d2h(i[0])+":"+this._d2h(i[1])+":"+this._d2h(i[2])+":"+this._d2h(i[3])+":"+this._d2h(i[4])+":"+this._d2h(i[5])}getEraseSize(t,s){return s}}},5422:(t,s,e)=>{e.d(s,{e:()=>i});class i{getEraseSize(t,s){return s}}}}]);
//# sourceMappingURL=413.b79d107d.chunk.js.map