# Asyx Ticketing system

This ticketing system has been created using reactjs, and it used Firebase cloud services for
storage of data such as users, tickets and notifications

## Features

This system can perfom the following functions
## `Authentication`

The syystem offers email and password authentication type. in order t o use it, first of all 
must sign up by adding his username which must be at least more than six characters, and his email which must be a valid email and password which must be at least eight (8) characters long. System will not accept the credentials which do not adthere to those guides and it will notify the user in order for user to  comply to them.

### `Creating tickets`

By clicking the plus button on th top bar navigation located on the top right  corner of the screen you can create new ticket
### `Open tickets`
By clicking the ticket on the main section of the system it will redirect you to the another tab within the system containing the information of the specific ticket
### `Closing ticket`

Once the ticket is opened on the new tab witing the system, there ae two options on the bottom of the ticket replies section, one of the option button is labelled as "close ticket",
by clicking the button it will close the ticket

### `Resolve the ticket`
Once the ticket is opened on the new tab witing the system, there ae two options on the bottom of the ticket replies section, one of the option button is labelled as "resolve ticket",
by clicking the button it will resolve the ticket

**Note:The system will automatically create notificiations for the important actions performed on the ticket  such as `creating new ticket`,`closing a ticket`,`resolving a ticket`**

You can access your notification by clicking the bell icon on the top bar navigation which is located on top of the screen. Moreover there are two actions that can be performed on the notification by clicking the three dots, these actions are `clear` which will delete the notification and `mark as read` which will mark the notification as read

## `Grouping tickets`
on the 'DASHBOARD' or home screen several created notifications will be listed and differentiated by colors based on their status. These status can are
`opened` for opened tickets
`closed` for closed tickets
`resolved` for resolved tickets
`new` for newly created tickets

### `Replying to a ticket`
Once the ticket is opened on the new tab witing the system, you can add reply to a ticket by filling the text typing area which has grey borders around it and clicking the `post` button below the textarea this will send your reply and it will automatically previewed below the box 


### `Sysytem statistics`

These can be accessed via the sider naviagtion menu on the left side of the screen by clicking the graph bar icon it will redirect to the statistics page.

