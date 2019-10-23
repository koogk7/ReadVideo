whale.commands.onCommand.addListener((command) => {
  if (command === 'open-sidebar') {
    whale.sidebarAction.show();
  }
});

whale.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if(message) {
		whale.tabs.sendMessage(sender.tab.id, message);
	}
});