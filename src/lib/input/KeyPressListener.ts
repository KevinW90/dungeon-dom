export default class KeyPressListener {
  [key: string]: any;

  constructor(key: string, callback: any) {
    this.keySafe = true;

    this.keydownFunction = (e: any) => {
      if (e.key === key && this.keySafe) {
        this.keySafe = false;
        callback();
      }
    };

    this.keyupFunction = (e: any) => {
      if (e.key === key) {
        this.keySafe = true;
      }
    };

    document.addEventListener("keydown", this.keydownFunction);
    document.addEventListener("keyup", this.keyupFunction);
  }

  unbind() {
    document.removeEventListener("keydown", this.keydownFunction);
    document.removeEventListener("keyup", this.keyupFunction);
  }
}
