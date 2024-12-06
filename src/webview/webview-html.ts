import * as vscode from 'vscode';

export function getWebviewContent(scriptUri: vscode.Uri): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hello World</title>
  <style>
    /* Ensure full height for html and body */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden; /* Prevent scrollbars if no content overflows */
    }

    /* Make sure the #root div takes the full available height */
    #root {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="${scriptUri}"> </script>
  <script>
     const vscode = acquireVsCodeApi();

      // Notify VS Code that the webview is ready then can do initial tasks
        vscode.postMessage({
          command: 'ready'
        });

       window.addEventListener('message', event => {

         console.log('window.addEventListener');
    
         if (event.data.command === 'callLocallyStoreObject') {
            console.log('window.addEventListener');

            vscode.postMessage({
              command: 'locallyStoreObject',
              message: event.data.message  // Forwarding the message to extension.ts
            });
          }

          if (event.data.command === 'callLocallyGetObject') {
              console.log('window.addEventListener');

              vscode.postMessage({
                command: 'locallyGetObject',
              });
          }

      
    });
  
  </script>
  
</body>
</html>`;
}
