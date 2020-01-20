import { Store } from '../../utils/db.utils';

const moment = require('moment');

let store = new Store();
let db = store.getStore();

/**
 * SEED FUNCTION  TO LOAD INITIAL TEST DATA
 */
async function main() {
    const user1 = await db.users.create({
        data: {
            firstName: 'Vignesh',
            lastName: 'T.V.',
            username: 'tvvignesh',
            displayName: 'Vignesh',
            dob: moment('1992-12-30').toDate(),
            email: {
                create: [
                    {
                        emailAddress: 'vignesh@timecampus.com',
                        emailType: 'primary',
                        alias: 'primary email'
                    }
                ]
            },
            phone: {
                create: [
                    {
                        contactNo: '+91-7358445777',
                        alias: 'personal mobile',
                        contactType: 'primary',
                        updatedDate: new Date()
                    }
                ]
            }
        }
    });

    console.log({ user1 });
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await db.disconnect();
    });
