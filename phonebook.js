class PhonebookApp extends FormApplication {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: 'retro-phonebook',
            template: RetroPhone.TEMPLATES.phonebook,
            title: 'Phonebook',
            width: 400,
            height: 600,
            classes: ['retro-phonebook-window']
        });
    }

    getData() {
        return {
            phonebook: RetroPhone.phonebook
        };
    }

    activateListeners(html) {
        super.activateListeners(html);

        html.find('.add-entry').click(this._onAddEntry.bind(this));
        html.find('.delete-entry').click(this._onDeleteEntry.bind(this));
        html.find('.toggle-type').click(this._onToggleType.bind(this));
    }

    async _updateObject(event, formData) {
        await game.settings.set(RetroPhone.ID, 'phonebook', RetroPhone.phonebook);
    }

    _onAddEntry(event) {
        const number = prompt('Enter phone number:');
        if (!number) return;

        RetroPhone.phonebook[number] = {
            type: 'text',
            name: prompt('Enter contact name:') || number,
            audioPath: ''
        };

        this.render();
    }

    _onDeleteEntry(event) {
        const number = event.currentTarget.dataset.number;
        delete RetroPhone.phonebook[number];
        this.render();
    }

    _onToggleType(event) {
        const number = event.currentTarget.dataset.number;
        const entry = RetroPhone.phonebook[number];
        entry.type = entry.type === 'audio' ? 'text' : 'audio';
        
        if (entry.type === 'audio') {
            new FilePicker({
                type: 'audio',
                callback: (path) => {
                    entry.audioPath = path;
                    this.render();
                }
            }).browse();
        }
        
        this.render();
    }
} 