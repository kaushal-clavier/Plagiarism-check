const vscode = require('vscode');
const axios = require('axios');

require('dotenv').config();

async function checkPlagiarism(code) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        vscode.window.showErrorMessage("OpenAI API key missing! Add it in .env");
        return;
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'user',
                        content: `Check this code for potential plagiarism or copy-paste similarity issues. Provide suspicious parts: \n${code}`
                    }
                ]
            },
            {
                headers: { Authorization: `Bearer ${apiKey}` }
            }
        );

        const result = response.data.choices[0].message.content;
        vscode.window.showInformationMessage("Plagiarism Check Result: " + result);
    } catch (err) {
        vscode.window.showErrorMessage("Error checking plagiarism: " + err.message);
    }
}

function activate(context) {
    console.log('🚀 Extension dev-plagrisum activated!');
    let disposable = vscode.commands.registerCommand('extension.checkPlagiarism', () => {
        vscode.window.showInformationMessage("✅ Plagiarism command works!");
    });
    context.subscriptions.push(disposable);
}


function deactivate() {}

module.exports = {
    activate,
    deactivate
};