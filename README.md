# Main Features (bare minimum)
Voting Site:
* ~All musicians are listed with a Vote button~
* ~Votes are tracked with IP Address Logger~
* If you voted all of the other musicians should disappear
* ~Thanks for voting screen with a button to remove your vote and get back to the original voting screen~

Country Voting Site:
* ~Countries can log in page~
* Page where countries can give their points from 12 - 1 (without the 11 since that is the country itself)

Admin Panel:
* ~Admin panel with a set username (root) and a password~
* ~Panel Staff can add the Musicians to the voting site~
* Live view of current Voting statistics
* ~Field for creating new Country Accounts~
* An export button to create a CSV file into an output folder

### Security notes:
* Should probably look into using certificates or at the very least an encryption method
* Currently vulnerable to MITM attacks both during and post client-server connection
* Vulnerable to ip-spoofing or users having reassigned ips in which case multiple votes can be cast by one person
