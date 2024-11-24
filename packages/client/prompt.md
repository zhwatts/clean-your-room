<!-- @format -->

Create a full web application, that accomplishes the following.

the web application is a browser based game, that a user can play. The purpose of the game is, you are a child, who needs to clean your room. the web app should display a box that represents the childs "room". In the bottom of the room, there is a "toy box". scattered through out the room is "clutter".

The objective of the game is, you are the child, and you can move around using arrow keys. You must walk up to each piece of clutter, press and hold space bar, and carry the clutter to the toy box. You must deposit the clutter in the toy box.

After all the clutter is in the toy box, the game is over.

You are being timed, as to how long it takes to pickup all the clutter and deposit successfully in the toy box.

If you release the spacebar while carrying a piece of clutter, it will fall to the ground, and turn red. Your are not permitted to pick this piece of cutter back up for 3 seconds. The fallen piece of clutter should have a count down on it (eg it should show how any seconds are remaning before you can pick it back up. Once the wait time elapses, it turns back to it's regular color, and you can pickt it back up.

At the top of the screen, you should see how much total time has elapsed since the game has started.

So, in summary we are:

1. Creating a modern React JS app, in typescript, using ViteJS framework. Create all the files, and the correct directory structure to accomplish my app as described.
2. The app codebase should be structured following best practices for OOP
3. I can select whether i'm a boy or a girl before I start the game. I should be able to select to "play as a new player", or "play as an existing" player. I should see a list of all players who have played before, and should be allowed to select from that list of previous players
4. I can enter my own name for my character
5. My settings should be preserved in a local storage item
6. The title of the game is "Clean Your Room!"
7. The objective of the game is to "Clean My Room", based on the over view I provided above
8. Top scores should be preserved in the local storage file, so I can track my skill progress over time
9. The graphics should be on bar with what I expect for a basic gameboy type game
