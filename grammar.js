/**
 * Created by anatal on 9/18/15.
 */

var appsGrammar;
var contactsGrammar;

function buildAppsGrammar () {
    console.log('buildAppsGrammar');

    if (!navigator.mozApps || !navigator.mozApps.mgmt) {
        console.log('buildAppsGrammar', 'navigator.mozApps not found');
        return;
    }

    var allApps = navigator.mozApps.mgmt.getAll();

    allApps.onsuccess = () => {
        console.log("success reading apps");
        var priorityLocale = "en-US";
        var priorityLang = "en-US";

        var appNames = allApps.result.filter((app) => {
                if (!app.manifest ||
                app.manifest.hasOwnProperty('role') ||
                app.manifest.name === 'Communications' ||
                app.manifest.name === 'Vaani') {
            return false;
        }

        return true;
    }).map((app) => {
        var appName = app.manifest.name;

                if (app.manifest.locales) {
                    if (app.manifest.locales.hasOwnProperty(priorityLocale) &&
                        app.manifest.locales[priorityLocale].hasOwnProperty('name')) {
                        appName = app.manifest.locales[priorityLocale].name;
                    }
                    else if (app.manifest.locales.hasOwnProperty(priorityLang) &&
                        app.manifest.locales[priorityLang].hasOwnProperty('name')) {
                        appName = app.manifest.locales[priorityLang].name;
                    }
                }

                return grammarclean(appName);
    });

    appsGrammar = appNames.join(' | ').toLocaleLowerCase();
    console.log('buildAppsGrammar:appsGrammar', appsGrammar);
    buildContactsGrammar();
    };
}

function buildContactsGrammar () {
    console.log('buildContactsGrammar');

    if (!navigator.mozContacts) {
        console.log('buildContactsGrammar', 'navigator.mozContacts not found');
        return;
    }

    var contacts = [];
    var request = navigator.mozContacts.getAll();

    request.onsuccess = function () {
        if (this.result) {
            if (this.result.tel.length > 0 &&
                this.result.name.length > 0 &&
                this.result.category &&
                this.result.category.includes('favorite')) {

                contacts.push(this.result);
            }

            // trigger request.onsuccess again with a new result
            this.continue();
        }
        else {
            var uniqueNames = {};

            contacts.forEach((contact) => {
                var name = grammarclean(contact.name[0]);
            var nameParts = name.split(' ');

            nameParts.forEach((part) => {
                uniqueNames[part] = true;
        });

        uniqueNames[name] = true;
    });

    var names = Object.keys(uniqueNames);
    contactsGrammar = names.join(' | ').toLocaleLowerCase();

    console.log('buildContactsGrammar:contacts', contacts);
    console.log('buildContactsGrammar:contactsGrammar', contactsGrammar);
    startengines();
    }
    };
}



function grammarclean(value){
        value = value.replace(/[^\w\s]/gi, '');
        value = value.replace(/\s+/g, ' ');

        return value;
}