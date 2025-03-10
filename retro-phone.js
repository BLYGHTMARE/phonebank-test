class RetroPhone {
    static ID = 'retro-phone';
    
    static TEMPLATES = {
        phoneApp: `modules/${this.ID}/templates/phone-app.hbs`,
        phonebook: `modules/${this.ID}/templates/phonebook.hbs`,
        chatWindow: `modules/${this.ID}/templates/chat-window.hbs`
    }

    static initialize() {
        this.phoneApp = null;
        this.phonebook = {};
        this.registerSettings();
    }

    static registerSettings() {
        game.settings.register(this.ID, 'phonebook', {
            name: 'Phonebook',
            scope: 'world',
            config: false,
            type: Object,
            default: {},
            onChange: value => {
                this.phonebook = value;
            }
        });
    }

    static async loadPhonebook() {
        this.phonebook = game.settings.get(this.ID, 'phonebook');
    }
}

Hooks.once('init', () => {
    RetroPhone.initialize();
});

Hooks.on('renderPlayerList', () => {
    if (!game.user.isGM) return;
    
    const phoneButton = $(`<div class="retro-phone-button">
        <i class="fas fa-phone"></i>
    </div>`);
    
    phoneButton.click(() => {
        if (!RetroPhone.phoneApp) {
            new PhoneApp().render(true);
        } else {
            RetroPhone.phoneApp.maximize();
            RetroPhone.phoneApp.bringToTop();
        }
    });

    $('#players').append(phoneButton);
}); 