export class Menu {
  static #instance = null;

  constructor() {
    if (Menu.#instance !== null) {
      throw new Error(
        "A new instance of Menu cannot be created directly. Use Menu.getInstance() instead."
      );
    }

    Menu.#instance = this;
    this.settingsButton = document.getElementById("settingsButton");
    this.settingsMenu = document.getElementById("settingsMenu");
    this.menuGroups = settingsMenu.querySelectorAll(".menu-group");
    this.resumeButton = document.getElementById("resumeButton");
    this.restartButton = document.getElementById("restartButton");
    this.soundEffectVolume = document.getElementById("soundEffectVolume");
    this.musicVolume = document.getElementById("musicVolume");
    this.autoShootSwitch = document.getElementById("autoShootSwitch");

    this.settingsButton.addEventListener("click", () => {
      this.game.pause = true;
    });

    this.resumeButton.addEventListener("click", () => {
      this.game.pause = false;
    });

    this.soundEffectVolume.addEventListener("input", (e) => {
      this.game.setSoundVolume(e.target.value);
    });

    this.musicVolume.addEventListener("input", (e) => {
      this.game.setMusicVolume(e.target.value);
    });

    this.autoShootSwitch.addEventListener("change", (e) => {
      this.game.autoShoot = e.target.checked;
    });
  }

  static getInstance() {
    if (Menu.#instance === null) {
      Menu.#instance = new Menu();
    }
    return Menu.#instance;
  }

  setGame(game) {
    this.game = game;
  }

  open() {
    this.settingsMenu.style.display = "block";
    this.settingsButton.style.display = "none";
  }

  close() {
    this.settingsMenu.style.display = "none";
    this.settingsButton.style.display = "block";
  }

  openGameOverMenu() {
    this.settingsMenu.style.display = "block";
    this.settingsButton.style.display = "none";
    this.resumeButton.style.display = "none";
    this.menuGroups.forEach((elem) => {
      elem.style.display = "none";
    });
  }

  onRestartGame(restartCallback) {
    this.restartButton.addEventListener("click", () => {
      if (window.confirm("Are you sure you want to restart game now?")) {
        this.setGame(restartCallback());
        this.game.music.load();
        this.game.setMusicVolume(this.musicVolume.value);
        this.game.setSoundVolume(this.soundEffectVolume.value);
        this.game.autoShoot = this.autoShootSwitch.checked;
        this.settingsMenu.style.display = "none";
        this.settingsButton.style.display = "none";
        this.resumeButton.style.display = "inline-flex";
        this.menuGroups.forEach((elem) => {
          elem.style.display = "flex";
        });
      }
    });
  }
}
