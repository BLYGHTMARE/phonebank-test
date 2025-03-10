class PhoneApp extends Application {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'retro-phone',
            template: RetroPhone.TEMPLATES.phoneApp,
            title: 'Retro Phone',
            width: 300,
            height: 500,
            minimizable: true,
            resizable: false,
            classes: ['retro-phone-window']
        });
    }

    getData() {
        return {
            isGM: game.user.isGM,
            phonebook: RetroPhone.phonebook
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.phone-keypad button').click(this._onKeypadPress.bind(this));
        html.find('.phone-call').click(this._onCall.bind(this));
        html.find('.phone-phonebook').click(this._onPhonebookOpen.bind(this));
        
        this.numberDisplay = html.find('.phone-display');
    }

    _onKeypadPress(event) {
        const digit = event.currentTarget.dataset.digit;
        const currentNumber = this.numberDisplay.text();
        this.numberDisplay.text(currentNumber + digit);
    }

    async _onCall() {
        const number = this.numberDisplay.text();
        if (!number) return;

        const phoneEntry = RetroPhone.phonebook[number];
        if (!phoneEntry) {
            ui.notifications.warn('Number not found');
            return;
        }

        if (phoneEntry.type === 'audio') {
            await this._handleAudioCall(phoneEntry);
        } else {
            this._handleTextChat(phoneEntry);
        }
    }

    async _handleAudioCall(phoneEntry) {
        const sound = await AudioHelper.play({
            src: phoneEntry.audioPath,
            volume: 0.8,
            loop: false
        });
    }

    _handleTextChat(phoneEntry) {
        new PhoneChatWindow(phoneEntry).render(true);
    }

    _onPhonebookOpen() {
        if (!game.user.isGM) return;
        new PhonebookApp().render(true);
    }
} 