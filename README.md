# Combine URL Extension  

When working with the same website or application, you often deal with multiple links where only the last part of the URL changes. This extension allows you to set up a fixed base URL and quickly access links by entering only the variable part.  

You can install the extension from [here](https://chrome.google.com/webstore/detail/combine-url/lnmkibhfmgahenghonphjlepcdbdjpon).  

## Demo
![Sample setup](img/demo-one.gif)  

## How It Works  

For example, if you manage multiple tasks in Jira, where all task URLs share the same base but differ in the final few characters:  

- `https://comp.com/browse/AX-3830`  
- `https://comp.com/browse/AX-3822`  
- `https://comp.com/browse/AX-2592`  

You can configure the extension like this:  

![Sample setup](img/simple-setup.png)  

Once set up, pressing **CTRL + SHIFT + F** opens a popup where you only need to enter the last four characters (e.g., `3830`). Pressing **Enter** or clicking the **Go** button will open the corresponding link in a new tab.  

![Sample link](img/taskUrl.png)  

### Right-Click Context Menu  

Additionally, you can use the browser’s **right-click context menu** to open a link. Simply select the task ID in any text, right-click, and choose the extension option to open the corresponding URL.  

Example:  

![Context menu](img/context-menu.png)  

## Handling Multiple Projects  

If you work across multiple projects with different prefixes, such as:  

- `https://comp.com/browse/PROD-3830`  
- `https://comp.com/browse/AB-3822`  
- `https://comp.com/browse/BUG-2592`  

You can configure the extension accordingly:  

![Multiple projects setup](img/multiple-projects.png)  

Now, when you use the extension (either via shortcut or right-click context menu), a separate tab will open for each project prefix, ensuring quick and efficient navigation.  
