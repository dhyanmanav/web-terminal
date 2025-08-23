/* ========= Enhanced Terminal Class ========= */
class EnhancedTerminal {
    constructor() {
        /* --- Enhanced file system with permissions --- */
        this.fs = {
            "/": {
                type: "dir",
                owner: "root",
                group: "root",
                permissions: "755",
                contents: {
                    home: { type: "dir", owner: "root", group: "root", permissions: "755", contents: {
                        user: { type: "dir", owner: "user", group: "user", permissions: "755", contents: {
                            documents: { type: "dir", owner: "user", group: "user", permissions: "755", contents: {
                                "readme.txt": {
                                    type: "file",
                                    owner: "user",
                                    group: "user",
                                    permissions: "644",
                                    content: "Welcome to Enhanced Terminal!\nFeatures:\n- File editing with nano\n- Password protection\n- System commands\n- Process management",
                                    size: 120,
                                    created: new Date("2025-08-01T10:00"),
                                    modified: new Date("2025-08-01T10:00")
                                }
                            }},
                            downloads: { type: "dir", owner: "user", group: "user", permissions: "755", contents: {} },
                            ".bashrc": {
                                type: "file",
                                owner: "user",
                                group: "user", 
                                permissions: "644",
                                content: "# User configuration\nalias ll='ls -l'\nalias la='ls -la'\nexport PATH=/usr/local/bin:/usr/bin:/bin",
                                size: 95,
                                created: new Date("2025-08-01T09:00")
                            }
                        }}
                    }},
                    etc: { type: "dir", owner: "root", group: "root", permissions: "755", contents: {
                        passwd: {
                            type: "file",
                            owner: "root",
                            group: "root",
                            permissions: "644",
                            content: "root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash",
                            size: 89,
                            created: new Date("2025-08-01T08:00")
                        }
                    }},
                    tmp: { type: "dir", owner: "root", group: "root", permissions: "777", contents: {} },
                    usr: { type: "dir", owner: "root", group: "root", permissions: "755", contents: {
                        bin: { type: "dir", owner: "root", group: "root", permissions: "755", contents: {} }
                    }}
                }
            }
        };

        /* --- System state --- */
        this.cwd = "/home/user";
        this.user = "user";
        this.host = "terminal";
        this.isRoot = false;
        this.history = [];
        this.hIndex = -1;
        this.processes = new Map();
        this.nextPid = 1000;
        this.systemUptime = new Date();
        this.isAuthenticated = true;
        
        /*voice*/
        /* === Voice Recognition Properties (Additive) === */
        this.isVoiceActive = false;
        this.speechRecognition = null;
        this.voiceButton = null;
        this.lastSpokenCommand = '';
        this.voiceAliases = {
        'sudo mode': 'su root',
        'become root': 'sudo su',
        'install package': 'sudo apt install',
        'update system': 'sudo apt update && sudo apt upgrade',
        'check disk space': 'df -h',
        'show running processes': 'ps aux',
        'network status': 'ping google.com'
        };
        this.initVoiceRecognition();


        /* --- Authentication --- */
        this.users = {
            user: { password: this.hashPassword("user123"), home: "/home/user", shell: "/bin/bash" },
            root: { password: this.hashPassword("root123"), home: "/root", shell: "/bin/bash" }
        };
        localStorage.removeItem('terminal_passwords');
        /* --- Load saved passwords --- */
        const savedPasswords = localStorage.getItem('terminal_passwords');
        if (savedPasswords) {
            this.users = { ...this.users, ...JSON.parse(savedPasswords) };
        }

        /* --- DOM handles --- */
        this.$input = document.getElementById("input");
        this.$output = document.getElementById("output");
        this.$prompt = document.getElementById("prompt");
        this.$userInfo = document.getElementById("user-info");
        this.$systemStatus = document.getElementById("system-status");

        /* --- Editor elements --- */
        this.$editorModal = document.getElementById("editor-modal");
        this.$editorTitle = document.getElementById("editor-title");
        this.$editorContent = document.getElementById("editor-content");
        this.$lineNumbers = document.getElementById("line-numbers");
        this.$editorStatus = document.getElementById("editor-status");
        this.$editorPosition = document.getElementById("editor-position");

        /* --- Password modal --- */
        this.$passwordModal = document.getElementById("password-modal");
        this.$passwordTitle = document.getElementById("password-title");
        this.$passwordInput = document.getElementById("password-input");

        /* --- Boot sequence --- */
        this.updatePrompt();
        this.updateUserInfo();
        this.bindEvents();
        this.startSystemProcesses();
        this.$input.focus();

        
    // ... your existing constructor code ...

    // Natural Language Input Properties
    this.nlInput = null;
    this.nlSubmitBtn = null;
    this.nlStatus = null;

    // Initialize natural language input components
    this.initNaturalLanguageInput();



}

   /* --- Natural Language Text Input Initialization --- */
initNaturalLanguageInput() {
    // Get input, button, and status elements
    this.nlInput = document.getElementById('nl-input');
    this.nlSubmitBtn = document.getElementById('nl-submit-btn');
    this.nlStatus = document.getElementById('nl-status');

    if (!this.nlInput || !this.nlSubmitBtn || !this.nlStatus) {
        console.warn('Natural language input elements not found');
        return;
    }

    this.bindNaturalLanguageEvents();
}

/* --- Bind Events for Natural Language Input --- */
bindNaturalLanguageEvents() {
    this.nlSubmitBtn.addEventListener('click', () => {
        this.processNaturalLanguageInput();
    });

    this.nlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.processNaturalLanguageInput();
        }
    });

    this.nlInput.addEventListener('input', () => {
        const text = this.nlInput.value.trim();
        if (text.length > 0) {
            this.updateNLStatus('Type Enter or click 🔄 to convert', 'var(--warning)');
        } else {
            this.updateNLStatus('Ready for natural language input', 'var(--success)');
        }
    });

    this.nlInput.addEventListener('focus', () => {
        this.nlInput.parentElement.style.boxShadow = '0 4px 20px rgba(0, 255, 0, 0.4)';
    });

    this.nlInput.addEventListener('blur', () => {
        this.nlInput.parentElement.style.boxShadow = '0 4px 15px rgba(0, 255, 0, 0.2)';
    });
}

/* --- Process the natural language input --- */
processNaturalLanguageInput() {
    const naturalText = this.nlInput.value.trim();
    if (!naturalText) {
        this.updateNLStatus('Please enter some text', 'var(--error)');
        return;
    }

    this.updateNLStatus('Converting...', 'var(--warning)');
    this.nlSubmitBtn.innerHTML = '⏳';

    const command = this.processNaturalLanguageCommand(naturalText);

    if (command && command !== naturalText.toLowerCase()) {
        // Show translated command and execute it
        this.echo(`💬 Natural Language: "${naturalText}"`, "info");
        this.echo(`→ Converted to: ${command}`, "success");

        this.$input.value = command;
        setTimeout(() => {
            this.interpret(command);
            this.$input.value = '';
        }, 800);

        this.updateNLStatus('✅ Converted successfully!', 'var(--success)');
        this.nlInput.parentElement.classList.add('nl-success-animation');
        setTimeout(() => {
            this.nlInput.parentElement.classList.remove('nl-success-animation');
        }, 600);

        this.nlInput.value = '';

    } else if (command === naturalText.toLowerCase()) {
        // Input is already a direct command
        this.echo(`💬 Command: "${naturalText}"`, "info");
        this.$input.value = command;
        setTimeout(() => {
            this.interpret(command);
            this.$input.value = '';
        }, 500);

        this.updateNLStatus('✅ Command executed!', 'var(--success)');
        this.nlInput.value = '';

    } else {
        // Unrecognized input
        this.updateNLStatus('❌ Command not recognized', 'var(--error)');
        this.echo(`💬 "${naturalText}" not recognized. Try: "list files", "create file test.txt", "go to documents"`, "warning");
    }

    // Reset button icon after delay
    setTimeout(() => {
        this.nlSubmitBtn.innerHTML = '🔄';
        if (this.nlInput.value.trim() === '') {
            this.updateNLStatus('Ready for natural language input', 'var(--success)');
        }
    }, 2000);
}

/* --- Natural Language Command Regex Patterns --- */
processNaturalLanguageCommand(text) {
    const command = text.toLowerCase().trim();

    // Check direct voice aliases first
    if (command in this.voiceAliases) {
        return this.voiceAliases[command];
    }

    // HELP / MANUAL
    if (/\b(user manual|manual|help|show help|commands|what can i do|show commands|list commands|available commands)\b/i.test(command)) {
        return "help";
    }

    // FILE LISTING
    if (/\b(list files?|list all files?|display files?|what files are here|files|contents|dir|directory contents?)\b/i.test(command)) {
        return "ls -la";
    }
    if (/\b(list|show)\s+(files?\s+)?(with\s+)?(details?|long\s+format)\b/i.test(command)) {
        return "ls -l";
    }
    if (/\b(list|show)\s+hidden\s+files?\b/i.test(command)) {
        return "ls -la";
    }

    // DIRECTORY NAVIGATION
    if (/\b(where am i|current directory|current location|show current directory|present working directory|current path|where)\b/i.test(command)) {
        return "pwd";
    }
    let cdMatch = command.match(/\b(?:change directory to|go to|navigate to|cd to|enter|open directory) (.+)/i)
               || command.match(/\b(?:go|cd) (.+)/i);
    if (cdMatch) {
        return `cd ${cdMatch[1].replace(/\s+/g, '_')}`;
    }
    if (/\b(go back|go up|back|up one level|parent directory)\b/i.test(command)) {
        return "cd ..";
    }
    if (/\b(go home|home directory|home)\b/i.test(command)) {
        return "cd ~";
    }

    // USER IDENTIFICATION
    if (/\b(who am i|current user|username|show user|my username|user)\b/i.test(command)) {
        return "whoami";
    }

    // DATE & TIME
    if (/\b(date|time|current date|current time|what time|todays? date|show date|show time)\b/i.test(command)) {
        return "date";
    }

    // CLEAR SCREEN
    if (/\b(clear|clear screen|clean screen|cls|clear terminal)\b/i.test(command)) {
        return "clear";
    }

    // COMMAND HISTORY
    if (/\b(history|command history|show history|previous commands|past commands)\b/i.test(command)) {
        return "history";
    }

    // FILE VIEWING / READING
    let fileViewMatch = command.match(/\b(?:show file content|show file|view file|read file|display file|cat file|open file) (?:of )?([^\s]+)/i)
                     || command.match(/\b(?:show|view|read|display|cat|open) (?:file )?([^\s]+)/i)
                     || command.match(/\b(?:content of|contents of) ([^\s]+)/i);
    if (fileViewMatch) {
        return `cat ${fileViewMatch[1]}`;
    }

    // FILE CREATION
    let createFileMatch = command.match(/\b(?:create|make|new|touch) (?:file )?([^\s]+)/i);
    if (createFileMatch) {
        return `touch ${createFileMatch[1]}`;
    }

    // DIRECTORY CREATION
    let mkdirMatch = command.match(/\b(?:create|make|new) (?:directory|folder|dir) ([^\s]+)/i)
                  || command.match(/\bmkdir ([^\s]+)/i);
    if (mkdirMatch) {
        return `mkdir ${mkdirMatch[1]}`;
    }

    // FILE EDITING
    let editMatch = command.match(/\b(?:edit|modify|change) (?:file )?([^\s]+)/i)
                 || command.match(/\b(?:nano|vim|editor) ([^\s]+)/i)
                 || command.match(/\bopen ([^\s]+) (?:in )?(editor|nano|vim)/i);
    if (editMatch) {
        return `nano ${editMatch[1]}`;
    }

    // FILE DELETION
    let deleteFileMatch = command.match(/\b(?:delete|remove|rm) (?:file )?([^\s]+)/i);
    if (deleteFileMatch) {
        return `rm ${deleteFileMatch[1]}`;
    }

    // DIRECTORY DELETION
    let deleteDirMatch = command.match(/\b(?:delete|remove|rm) (?:directory|folder|dir) ([^\s]+)/i)
                      || command.match(/\brmdir ([^\s]+)/i);
    if (deleteDirMatch) {
        return `rmdir ${deleteDirMatch[1]}`;
    }

    // FILE COPYING
    let copyMatch = command.match(/\b(?:copy|cp) ([^\s]+) (?:to )?([^\s]+)/i);
    if (copyMatch) {
        return `cp ${copyMatch[1]} ${copyMatch[1]}`;
    }

    // FILE MOVING/RENAMING
    let moveMatch = command.match(/\b(?:move|mv|rename) ([^\s]+) (?:to )?([^\s]+)/i);
    if (moveMatch) {
        return `mv ${moveMatch[1]} ${moveMatch[1]}`;
    }

    // FILE SEARCHING
    let findMatch = command.match(/\b(?:find|search for|locate) (?:file )?([^\s]+)/i);
    if (findMatch) {
        return `find . -name "${findMatch[1]}"`;
    }

    let grepMatch = command.match(/\b(?:search|grep|find) (?:for )?([^\s]+) (?:in )?([^\s]+)/i);
    if (grepMatch) {
        return `grep ${grepMatch[1]} ${grepMatch[1]}`;
    }

    // FILE PERMISSIONS
    let chmodMatch = command.match(/\b(?:change permissions?|chmod) ([0-7]{3}) (?:of |for )?([^\s]+)/i);
    if (chmodMatch) {
        return `chmod ${chmodMatch[1]} ${chmodMatch[1]}`;
    }

    // SYSTEM INFORMATION
    if (/\b(show processes?|list processes?|running processes?|ps|process list)\b/i.test(command)) {
        return "ps aux";
    }

    let killMatch = command.match(/\b(?:kill|stop|terminate) (?:process )?([0-9]+)/i);
    if (killMatch) {
        return `kill ${killMatch[1]}`;
    }

    if (/\b(disk space|storage|disk usage|df|free space)\b/i.test(command)) {
        return "df -h";
    }

    if (/\b(memory|ram|memory usage|free memory)\b/i.test(command)) {
        return "free -h";
    }

    if (/\b(uptime|system uptime|how long running)\b/i.test(command)) {
        return "uptime";
    }

    if (/\b(users|list users|show users|who)\b/i.test(command)) {
        return "users";
    }

    if (/\b(groups|user groups|show groups)\b/i.test(command)) {
        return "groups";
    }

    // DIRECTORY TREE
    if (/\b(tree|directory tree|folder tree|show tree)\b/i.test(command)) {
        return "tree";
    }

    let treeMatch = command.match(/\b(?:tree|show tree) (?:of )?([^\s]+)/i);
    if (treeMatch) {
        return `tree ${treeMatch[1]}`;
    }

    // DISK USAGE
    let duMatch = command.match(/\b(disk usage|du|size) (?:of )?([^\s]+)/i);
    if (duMatch) {
        return `du -h ${duMatch[9]}`;
    }

    // FILE HEAD/TAIL
    let headMatch = command.match(/\b(head|first lines?|beginning) (?:of )?([^\s]+)/i)
                 || command.match(/\b(show first|first) ([0-9]+) (?:lines? )?(?:of )?([^\s]+)/i);
    if (headMatch) {
        if (headMatch[10]) {
            return `head -n ${headMatch[9]} ${headMatch[10]}`;
        }
        return `head ${headMatch[1]}`;
    }

    let tailMatch = command.match(/\b(tail|last lines?|end) (?:of )?([^\s]+)/i)
                 || command.match(/\b(show last|last) ([0-9]+) (?:lines? )?(?:of )?([^\s]+)/i);
    if (tailMatch) {
        if (tailMatch[10]) {
            return `tail -n ${tailMatch[1]} ${tailMatch[1]}`;
        }
        return `tail ${tailMatch[1]}`;
    }

    // WORD COUNT
    let wcMatch = command.match(/\b(word count|line count|count|wc) (?:of )?([^\s]+)/i);
    if (wcMatch) {
        return `wc ${wcMatch[1]}`;
    }

    // NETWORK COMMANDS
    let pingMatch = command.match(/\b(ping|test connection|check connection) (?:to )?([^\s]+)/i);
    if (pingMatch) {
        return `ping ${pingMatch[1]}`;
    }

    let wgetMatch = command.match(/\b(download|wget|get) ([^\s]+)/i);
    if (wgetMatch) {
        return `wget ${wgetMatch[1]}`;
    }

    let curlMatch = command.match(/\b(curl|http request|web request) ([^\s]+)/i);
    if (curlMatch) {
        return `curl ${curlMatch[1]}`;
    }

    // SYSTEM ADMINISTRATION
    if (/\b(become root|switch to root|root access|sudo mode)\b/i.test(command)) {
        return "su root";
    }

    if (/\b(exit|logout|quit|leave)\b/i.test(command)) {
        return "exit";
    }

    if (/\b(restart|reboot|reboot system)\b/i.test(command)) {
        return "reboot";
    }

    if (/\b(shutdown|power off|turn off)\b/i.test(command)) {
        return "shutdown";
    }

    let passwdMatch = command.match(/\b(change password|passwd|password)(?: for)? ([^\s]*)/i);
    if (passwdMatch) {
        return passwdMatch[2] ? `passwd ${passwdMatch[9]}` : "passwd";
    }

    // ECHO COMMAND
    let echoMatch = command.match(/\b(echo|print|say|output) (.+)/i);
    if (echoMatch) {
        return `echo ${echoMatch[1]}`;
    }

    // SYSTEM INFO
    if (/\b(system info|uname|system|os info|operating system)\b/i.test(command)) {
        return "uname -a";
    }

    // If no pattern matched, return the original command
    return command;
}

/* --- Update status message for the natural language input --- */
updateNLStatus(text, color = 'var(--success)') {
    if (this.nlStatus) {
        this.nlStatus.textContent = text;
        this.nlStatus.style.color = color;
    }
}

    /* === Voice Recognition Initialization (Additive) === */
initVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        this.echo("Voice recognition not supported in this browser", "error");
        return;
    }
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = false;
    this.speechRecognition.interimResults = false;
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.maxAlternatives = 1;

    this.bindVoiceEvents();
    this.createVoiceUI();
}
/* === Voice UI (Additive) === */
createVoiceUI() {
    const voiceContainer = document.createElement('div');
    voiceContainer.className = 'voice-controls';
    voiceContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        gap: 10px;
        align-items: center;
    `;
    this.voiceButton = document.createElement('button');
    this.voiceButton.innerHTML = '🎤';
    this.voiceButton.title = 'Click to speak command or press Ctrl+Space';
    this.voiceButton.className = 'voice-btn';
    this.voiceButton.style.cssText = `
        padding: 10px;
        border: 2px solid var(--primary);
        background: var(--background);
        color: var(--primary);
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        transition: all 0.3s ease;
    `;
    const voiceStatus = document.createElement('span');
    voiceStatus.id = 'voice-status';
    voiceStatus.textContent = 'Voice: Ready';
    voiceStatus.style.cssText = `
        color: var(--success);
        font-size: 14px;
        font-weight: bold;
    `;
    voiceContainer.appendChild(this.voiceButton);
    voiceContainer.appendChild(voiceStatus);
    document.body.appendChild(voiceContainer);

    this.voiceButton.addEventListener('click', () => this.toggleVoiceRecognition());
}
    /* === Bind Speech Events (Additive) === */
bindVoiceEvents() {
    if (!this.speechRecognition) return;

    this.speechRecognition.onstart = () => {
        this.isVoiceActive = true;
        this.updateVoiceStatus('Listening...', 'var(--warning)');
        this.voiceButton.style.background = 'var(--warning)';
        this.voiceButton.innerHTML = '🔴';
    };

    this.speechRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        const confidence = event.results[0][0].confidence;
        this.lastSpokenCommand = transcript;
        this.echo(
            `🎤 Voice Command: "${transcript}" (${Math.round(confidence * 100)}% confidence)`,
            "info"
        );
        this.processVoiceCommand(transcript);
    };

    this.speechRecognition.onend = () => {
        this.isVoiceActive = false;
        this.updateVoiceStatus('Voice: Ready', 'var(--success)');
        this.voiceButton.style.background = 'var(--background)';
        this.voiceButton.innerHTML = '🎤';
    };

    this.speechRecognition.onerror = (event) => {
        this.isVoiceActive = false;
        this.updateVoiceStatus(`Voice Error: ${event.error}`, 'var(--error)');
        this.voiceButton.style.background = 'var(--background)';
        this.voiceButton.innerHTML = '🎤';
        if (event.error === 'not-allowed') {
            this.echo(
                "Microphone access denied. Please allow microphone permissions.",
                "error"
            );
        }
    };

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.code === 'Space') {
            e.preventDefault();
            this.toggleVoiceRecognition();
        }
    });
}

    /* === Voice Command Natural Language Processor (Additive) === */
processVoiceCommand(transcript) {
    const command = transcript.toLowerCase();
    let processedCommand = '';
    if (command in this.voiceAliases) {
        processedCommand = this.voiceAliases[command];
    } else if (command.includes('list files') || command.includes('show files')) {
        processedCommand = 'ls -la';
    } else if (command.includes('change directory to') || command.includes('go to')) {
        const dirMatch = command.match(/(?:change directory to|go to)\s+(.+)/);
        if (dirMatch) {
            processedCommand = `cd ${dirMatch[1].replace(/\s+/g, '_')}`;
        }
    } else if (command.includes('create directory') || command.includes('make directory')) {
        const dirMatch = command.match(/(?:create directory|make directory)\s+(.+)/);
        if (dirMatch) {
            processedCommand = `mkdir ${dirMatch[1].replace(/\s+/g, '_')}`;
        }
    } 
     else if (command.includes('create file') || command.includes('make file')) {
        const fileMatch = command.match(/(?:create file|make file)\s+(.+)/);
        if (fileMatch) {
            processedCommand = `touch ${fileMatch[1].replace(/\s+/g, '_')}`;
        }
    }  else if (command.includes('show file content') || command.includes('show file')) {
        const fileMatch = command.match(/(?:show file content|show file)\s+(.+)/);
        if (fileMatch) {
            processedCommand = `cat ${fileMatch[1].replace(/\s+/g, '_')}`;
        }
    } 
    else if (command.includes('edit file')) {
        const fileMatch = command.match(/edit file\s+(.+)/);
        if (fileMatch) {
            processedCommand = `nano ${fileMatch[1].replace(/\s+/g, '_')}`;
        }
    } else if (command.includes('delete file') || command.includes('remove file')) {
        const fileMatch = command.match(/(?:delete file|remove file)\s+(.+)/);
        if (fileMatch) {
            processedCommand = `rm ${fileMatch[1].replace(/\s+/g, '_')}`;
        }
    } else if (command.includes('clear screen') || command === 'clear') {
        processedCommand = 'clear';
    } 
    else if (command.includes('todays date') || command.includes('date')) {
        processedCommand = 'date';
    }else if (command.includes('show current directory') || command.includes('where am i')) {
        processedCommand = 'pwd';
    } 
    else if (command.includes('manual') || command.includes('user manual')) {
        processedCommand = 'help';
    } 
    else if (command.includes('help')) {
        processedCommand = 'help';
    }
    else if (command.includes('show history')) {
        processedCommand = 'history';
    } else if (command.includes('who am i') || command.includes('current user')) {
        processedCommand = 'whoami';
    } else if (command.includes('go back')) {
        processedCommand = 'cd ..';
    } else if (command.includes('go home')) {
        processedCommand = 'cd ~';
    } else if (command.includes('list all')) {
        processedCommand = 'ls -la';
    } else {
        processedCommand = transcript;
    }

    if (processedCommand) {
        if (processedCommand !== transcript) {
            this.echo(`→ Translated to: ${processedCommand}`, "success");
        }
        this.$input.value = processedCommand;
        setTimeout(() => {
            this.interpret(processedCommand);
            this.$input.value = '';
        }, 500);
    } else {
        this.echo("Voice command not recognized. Try saying 'list files' or 'clear screen'", "warning");
    }
}
    /* === Voice Toggle and Status (Additive) === */
toggleVoiceRecognition() {
    if (!this.speechRecognition) {
        this.echo("Speech recognition not available", "error");
        return;
    }
    if (this.isVoiceActive) {
        this.speechRecognition.stop();
    } else {
        try {
            this.speechRecognition.start();
        } catch (error) {
            this.echo(`Voice recognition error: ${error.message}`, "error");
        }
    }
}

updateVoiceStatus(text, color) {
    const status = document.getElementById('voice-status');
    if (status) {
        status.textContent = text;
        status.style.color = color;
    }
}

    /* ========= Authentication System ========= */
    hashPassword(password) {
        // Simple hash function for demo purposes
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash >>> 0; // fixed
 // Convert to 32-bit integer
        }
        return hash.toString();
    }

    savePasswords() {
        localStorage.setItem('terminal_passwords', JSON.stringify(this.users));
    }

    promptPassword(title = "Enter Password") {
        return new Promise((resolve) => {
            this.$passwordTitle.textContent = title;
            this.$passwordInput.value = "";
            this.$passwordModal.classList.add("active");
            this.$passwordInput.focus();

            const handleOk = () => {
                const password = this.$passwordInput.value;
                this.$passwordModal.classList.remove("active");
                cleanup();
                resolve(password);
            };

            const handleCancel = () => {
                this.$passwordModal.classList.remove("active");
                cleanup();
                resolve(null);
            };

            const handleKeydown = (e) => {
                if (e.key === "Enter") handleOk();
                if (e.key === "Escape") handleCancel();
            };

            const cleanup = () => {
                document.getElementById("password-ok").removeEventListener("click", handleOk);
                document.getElementById("password-cancel").removeEventListener("click", handleCancel);
                this.$passwordInput.removeEventListener("keydown", handleKeydown);
            };

            document.getElementById("password-ok").addEventListener("click", handleOk);
            document.getElementById("password-cancel").addEventListener("click", handleCancel);
            this.$passwordInput.addEventListener("keydown", handleKeydown);
        });
    }

    /* ========= Process Management ========= */
    startSystemProcesses() {
        this.addProcess("init", "root", "/sbin/init");
        this.addProcess("systemd", "root", "/lib/systemd/systemd");
        this.addProcess("bash", this.user, "/bin/bash");
    }

    addProcess(name, user, command) {
        const pid = this.nextPid++;
        this.processes.set(pid, {
            pid,
            name,
            user,
            command,
            started: new Date(),
            status: "running"
        });
        return pid;
    }

    killProcess(pid) {
        if (this.processes.has(pid)) {
            this.processes.get(pid).status = "terminated";
            this.processes.delete(pid);
            return true;
        }
        return false;
    }

    /* ========= Event Binding ========= */
    bindEvents() {
        this.$input.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                const cmd = this.$input.value.trim();
                this.$input.value = "";
                if (cmd) {
                    this.history.push(cmd);
                    this.hIndex = this.history.length;
                }
                this.echo(`\n${this.$prompt.textContent}${cmd}`);
                this.interpret(cmd);
                this.scrollToBottom();
            }

            if (e.key === "ArrowUp") {
                if (this.hIndex > 0) this.$input.value = this.history[--this.hIndex] || "";
                e.preventDefault();
            }
            if (e.key === "ArrowDown") {
                if (this.hIndex < this.history.length - 1)
                    this.$input.value = this.history[++this.hIndex] || "";
                else {
                    this.hIndex = this.history.length;
                    this.$input.value = "";
                }
                e.preventDefault();
            }

            if (e.key === "Tab") {
                e.preventDefault();
                this.autocomplete(this.$input.value);
            }

            if (e.ctrlKey && e.key === "c") {
                this.$input.value = "";
                this.echo("\n^C");
                this.scrollToBottom();
            }

            if (e.ctrlKey && e.key === "l") {
                e.preventDefault();
                this.cmdClear();
            }
        });

        // Editor events
        this.bindEditorEvents();
    }

    bindEditorEvents() {
        document.getElementById("save-btn").addEventListener("click", () => this.saveFile());
        document.getElementById("exit-btn").addEventListener("click", () => this.closeEditor());

        this.$editorContent.addEventListener("keydown", e => {
            if (e.ctrlKey && e.key === "s") {
                e.preventDefault();
                this.saveFile();
            }
            if (e.ctrlKey && e.key === "x") {
                e.preventDefault();
                this.closeEditor();
            }
        });

        this.$editorContent.addEventListener("input", () => {
            this.updateLineNumbers();
            this.updateEditorPosition();
        });

        this.$editorContent.addEventListener("keyup", () => {
            this.updateEditorPosition();
        });

        this.$editorContent.addEventListener("click", () => {
            this.updateEditorPosition();
        });
    }

    /* ========= Core Helpers ========= */
    updatePrompt() {
        const promptChar = this.isRoot ? "#" : "$";
        const displayPath = this.cwd === this.users[this.user].home ? "~" : this.cwd;
        this.$prompt.textContent = `${this.user}@${this.host}:${displayPath}${promptChar} `;
    }

    updateUserInfo() {
        this.$userInfo.textContent = `${this.user}@${this.host}`;
        this.$systemStatus.style.color = this.isAuthenticated ? "var(--success)" : "var(--error)";
    }

    echo(text, className = "") {
        const span = document.createElement("span");
        if (className) span.className = className;
        span.textContent = text + "\n";
        this.$output.appendChild(span);
    }

    scrollToBottom() {
        this.$output.scrollTop = this.$output.scrollHeight;
    }

    /* ========= Path Utilities ========= */
    resolve(path) {
        if (!path || path === "~") return this.users[this.user].home;
        if (path.startsWith("~/")) return this.users[this.user].home + path.slice(1);
        if (path.startsWith("/")) return path;
        if (path === ".") return this.cwd;
        if (path === "..") {
            return this.cwd === "/" ? "/" : this.cwd.replace(/\/[^/]+$/, "") || "/";
        }
        return this.cwd === "/" ? `/${path}` : `${this.cwd}/${path}`;
    }

    node(path) {
        const parts = path.split("/").filter(Boolean);
        let cur = this.fs["/"];
        for (const p of parts) {
            if (!cur.contents?.[p]) return null;
            cur = cur.contents[p];
        }
        return cur;
    }

    hasPermission(node, operation = "read") {
        if (!node) return false;
        if (this.isRoot) return true;
        
        const perms = node.permissions || "644";
        const owner = node.owner || "root";
        
        if (owner === this.user) {
            // Owner permissions
            const ownerPerms = parseInt(perms[0]);
            if (operation === "read" && (ownerPerms & 4)) return true;
            if (operation === "write" && (ownerPerms & 2)) return true;
            if (operation === "execute" && (ownerPerms & 1)) return true;
        } else {
            // Other permissions
            const otherPerms = parseInt(perms[2]);
            if (operation === "read" && (otherPerms & 4)) return true;
            if (operation === "write" && (otherPerms & 2)) return true;
            if (operation === "execute" && (otherPerms & 1)) return true;
        }
        
        return false;
    }

    /* ========= Command Interpreter ========= */
    interpret(raw) {
        if (!raw.trim()) return;
        
        const [cmd, ...args] = raw.split(/\s+/);
        
        // Handle sudo
        if (cmd === "sudo") {
            return this.cmdSudo(args);
        }
        
        switch (cmd) {
            // System commands
            case "shutdown": return this.cmdShutdown(args);
            case "reboot": return this.cmdReboot();
            case "passwd": return this.cmdPasswd(args);
            case "su": return this.cmdSu(args);
            case "exit": return this.cmdExit();
            
            // File operations
            case "nano":
            case "vim": return this.cmdEditor(args);
            case "cp": return this.cmdCp(args);
            case "mv": return this.cmdMv(args);
            case "find": return this.cmdFind(args);
            case "grep": return this.cmdGrep(args);
            case "head": return this.cmdHead(args);
            case "tail": return this.cmdTail(args);
            case "wc": return this.cmdWc(args);
            case "chmod": return this.cmdChmod(args);
            
            // Directory operations
            case "tree": return this.cmdTree(args);
            case "du": return this.cmdDu(args);
            
            // System info
            case "ps": return this.cmdPs(args);
            case "kill": return this.cmdKill(args);
            case "df": return this.cmdDf();
            case "free": return this.cmdFree();
            case "uptime": return this.cmdUptime();
            case "history": return this.cmdHistory();
            case "users": return this.cmdUsers();
            case "groups": return this.cmdGroups();
            
            // Network simulation
            case "ping": return this.cmdPing(args);
            case "wget": return this.cmdWget(args);
            case "curl": return this.cmdCurl(args);
            
            // Basic commands
            case "date": return this.cmdDate();
            case "pwd": return this.echo(this.cwd);
            case "ls": return this.cmdLs(args);
            case "cd": return this.cmdCd(args);
            case "mkdir": return this.cmdMkdir(args);
            case "touch": return this.cmdTouch(args);
            case "cat": return this.cmdCat(args);
            case "rm": return this.cmdRm(args);
            case "rmdir": return this.cmdRmdir(args);
            case "clear": return this.cmdClear();
            case "whoami": return this.echo(this.user);
            case "uname": return this.echo("EnhancedTerminal JS x86_64");
            case "echo": return this.echo(args.join(" "));
            case "help": return this.cmdHelp();
            
            default: return this.echo(`Command not found: ${cmd}`, "error");
        }
    }

    /* ========= System Commands ========= */
    async cmdShutdown(args) {
        if (!this.isRoot) {
            return this.echo("shutdown: Permission denied (try sudo)", "error");
        }
        
        const time = args.includes("-h") ? "now" : args[0] || "now";
        this.echo(`Shutdown scheduled for ${time}`);
        
        for (let i = 5; i > 0; i--) {
            this.echo(`System will shutdown in ${i} seconds...`, "warning");
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        this.echo("System halted.", "info");
        this.$systemStatus.style.color = "var(--error)";
        this.$input.disabled = true;
    }

    cmdReboot() {
        if (!this.isRoot) {
            return this.echo("reboot: Permission denied (try sudo)", "error");
        }
        
        this.echo("Rebooting system...", "info");
        setTimeout(() => {
            location.reload();
        }, 2000);
    }

    async cmdPasswd(args) {
        const targetUser = args[0] || this.user;
        
        if (targetUser !== this.user && !this.isRoot) {
            return this.echo("passwd: Permission denied", "error");
        }
        
        if (!this.users[targetUser]) {
            return this.echo(`passwd: user '${targetUser}' does not exist`, "error");
        }
        
        // Current password verification
        if (targetUser === this.user) {
            const currentPass = await this.promptPassword("Current password:");
            if (!currentPass || this.hashPassword(currentPass) !== this.users[targetUser].password) {
                return this.echo("passwd: Authentication token manipulation error", "error");
            }
        }
        
        const newPass = await this.promptPassword("New password:");
        if (!newPass) {
            return this.echo("passwd: Password unchanged", "warning");
        }
        
        const confirmPass = await this.promptPassword("Confirm new password:");
        if (newPass !== confirmPass) {
            return this.echo("passwd: Sorry, passwords do not match", "error");
        }
        
        this.users[targetUser].password = this.hashPassword(newPass);
        this.savePasswords();
        this.echo("passwd: password updated successfully", "success");
    }

    async cmdSu(args) {
        const targetUser = args[0] || "root";
        
        if (!this.users[targetUser]) {
            return this.echo(`su: user ${targetUser} does not exist`, "error");
        }
        
        if (targetUser !== this.user) {
            const password = await this.promptPassword(`Password for ${targetUser}:`);
            if (!password || this.hashPassword(password) !== this.users[targetUser].password) {
                return this.echo("su: Authentication failure", "error");
            }
        }
        
        this.user = targetUser;
        this.isRoot = targetUser === "root";
        this.cwd = this.users[targetUser].home;
        this.updatePrompt();
        this.updateUserInfo();
        this.echo(`Switched to user: ${targetUser}`, "success");
    }

    async cmdSudo(args) {
        if (!args.length) {
            return this.echo("sudo: command required", "error");
        }
        
        const password = await this.promptPassword("Password for sudo:");
        if (!password || this.hashPassword(password) !== this.users[this.user].password) {
            return this.echo("sudo: Authentication failure", "error");
        }
        
        const wasRoot = this.isRoot;
        this.isRoot = true;
        this.interpret(args.join(" "));
        this.isRoot = wasRoot;
    }

    cmdExit() {
        if (this.user !== "user") {
            this.user = "user";
            this.isRoot = false;
            this.cwd = "/home/user";
            this.updatePrompt();
            this.updateUserInfo();
            this.echo("Returned to user session", "info");
        } else {
            this.echo("Goodbye!", "info");
            setTimeout(() => window.close(), 1000);
        }
    }

    /* ========= File Editor ========= */
    cmdEditor(args) {
        const filename = args[0];
        if (!filename) {
            return this.echo("Usage: nano <filename>", "error");
        }
        
        this.openEditor(filename);
    }

    openEditor(filename) {
        const filepath = this.resolve(filename);
        const file = this.node(filepath);
        
        this.currentEditorFile = filepath;
        this.currentEditorFilename = filename;
        
        if (file && file.type === "file") {
            if (!this.hasPermission(file, "read")) {
                return this.echo("nano: Permission denied", "error");
            }
            this.$editorContent.value = file.content || "";
        } else {
            this.$editorContent.value = "";
        }
        
        this.$editorTitle.textContent = `nano - ${filename}`;
        this.$editorModal.classList.add("active");
        this.$editorContent.focus();
        this.updateLineNumbers();
        this.updateEditorPosition();
    }

    updateLineNumbers() {
        const lines = this.$editorContent.value.split('\n');
        const lineNumbers = lines.map((_, i) => i + 1).join('\n');
        this.$lineNumbers.textContent = lineNumbers;
    }

    updateEditorPosition() {
        const content = this.$editorContent.value;
        const selectionStart = this.$editorContent.selectionStart;
        const lines = content.substring(0, selectionStart).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        this.$editorPosition.textContent = `Line ${line}, Col ${col}`;
    }

    saveFile() {
        const content = this.$editorContent.value;
        const parentPath = this.currentEditorFile.replace(/\/[^/]+$/, "") || "/";
        const parent = this.node(parentPath);
        const filename = this.currentEditorFilename.split("/").pop();
        
        if (!parent) {
            this.$editorStatus.textContent = "Error: Invalid path";
            return;
        }
        
        if (!this.hasPermission(parent, "write")) {
            this.$editorStatus.textContent = "Error: Permission denied";
            return;
        }
        
        parent.contents[filename] = {
            type: "file",
            owner: this.user,
            group: this.user,
            permissions: "644",
            content: content,
            size: content.length,
            created: parent.contents[filename]?.created || new Date(),
            modified: new Date()
        };
        
        this.$editorStatus.textContent = "File saved successfully";
        setTimeout(() => {
            this.$editorStatus.textContent = "Ready";
        }, 2000);
    }

    closeEditor() {
        this.$editorModal.classList.remove("active");
        this.$input.focus();
    }

    /* ========= Enhanced File Commands ========= */
    cmdCp(args) {
        if (args.length < 2) {
            return this.echo("Usage: cp <source> <destination>", "error");
        }
        
        const [source, dest] = args;
        const srcPath = this.resolve(source);
        const srcNode = this.node(srcPath);
        
        if (!srcNode) {
            return this.echo(`cp: cannot stat '${source}': No such file or directory`, "error");
        }
        
        if (!this.hasPermission(srcNode, "read")) {
            return this.echo(`cp: cannot open '${source}': Permission denied`, "error");
        }
        
        const destPath = this.resolve(dest);
        const destParentPath = destPath.replace(/\/[^/]+$/, "") || "/";
        const destParent = this.node(destParentPath);
        
        if (!destParent || !this.hasPermission(destParent, "write")) {
            return this.echo(`cp: cannot create '${dest}': Permission denied`, "error");
        }
        
        const destName = dest.split("/").pop();
        destParent.contents[destName] = JSON.parse(JSON.stringify(srcNode));
        destParent.contents[destName].owner = this.user;
        destParent.contents[destName].created = new Date();
        
        this.echo(`Copied '${source}' to '${dest}'`, "success");
    }

    cmdMv(args) {
        if (args.length < 2) {
            return this.echo("Usage: mv <source> <destination>", "error");
        }
        
        // First copy, then remove source
        this.cmdCp(args);
        this.cmdRm([args[0]]);
    }

    cmdFind(args) {
        const searchPath = args || this.cwd;
        const pattern = args[args.indexOf("-name") + 1];
        
        if (!pattern) {
            return this.echo("Usage: find <path> -name <pattern>", "error");
        }
        
        this.findInDirectory(searchPath, pattern);
    }

    findInDirectory(path, pattern, results = []) {
        const node = this.node(path);
        if (!node || node.type !== "dir") return results;
        
        Object.keys(node.contents).forEach(name => {
            const fullPath = path === "/" ? `/${name}` : `${path}/${name}`;
            
            if (name.includes(pattern.replace(/\*/g, ""))) {
                this.echo(fullPath);
            }
            
            if (node.contents[name].type === "dir") {
                this.findInDirectory(fullPath, pattern, results);
            }
        });
    }

    cmdGrep(args) {
        if (args.length < 2) {
            return this.echo("Usage: grep <pattern> <file>", "error");
        }
        
        const [pattern, filename] = args;
        const file = this.node(this.resolve(filename));
        
        if (!file || file.type !== "file") {
            return this.echo(`grep: ${filename}: No such file or directory`, "error");
        }
        
        if (!this.hasPermission(file, "read")) {
            return this.echo(`grep: ${filename}: Permission denied`, "error");
        }
        
        const lines = file.content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes(pattern)) {
                this.echo(`${index + 1}: ${line}`);
            }
        });
    }

    cmdHead(args) {
        const filename = args[args.length - 1];
        const lines = args.includes("-n") ? parseInt(args[args.indexOf("-n") + 1]) : 10;
        
        const file = this.node(this.resolve(filename));
        if (!file || file.type !== "file") {
            return this.echo(`head: ${filename}: No such file or directory`, "error");
        }
        
        if (!this.hasPermission(file, "read")) {
            return this.echo(`head: ${filename}: Permission denied`, "error");
        }
        
        const fileLines = file.content.split('\n');
        fileLines.slice(0, lines).forEach(line => this.echo(line));
    }

    cmdTail(args) {
        const filename = args[args.length - 1];
        const lines = args.includes("-n") ? parseInt(args[args.indexOf("-n") + 1]) : 10;
        
        const file = this.node(this.resolve(filename));
        if (!file || file.type !== "file") {
            return this.echo(`tail: ${filename}: No such file or directory`, "error");
        }
        
        if (!this.hasPermission(file, "read")) {
            return this.echo(`tail: ${filename}: Permission denied`, "error");
        }
        
        const fileLines = file.content.split('\n');
        fileLines.slice(-lines).forEach(line => this.echo(line));
    }

    cmdWc(args) {
        const filename = args[0];
        if (!filename) {
            return this.echo("Usage: wc <filename>", "error");
        }
        
        const file = this.node(this.resolve(filename));
        if (!file || file.type !== "file") {
            return this.echo(`wc: ${filename}: No such file or directory`, "error");
        }
        
        if (!this.hasPermission(file, "read")) {
            return this.echo(`wc: ${filename}: Permission denied`, "error");
        }
        
        const content = file.content;
        const lines = content.split('\n').length;
        const words = content.split(/\s+/).filter(w => w.length > 0).length;
        const chars = content.length;
        
        this.echo(`${lines} ${words} ${chars} ${filename}`);
    }

    cmdChmod(args) {
        if (args.length < 2) {
            return this.echo("Usage: chmod <permissions> <file>", "error");
        }
        
        const [perms, filename] = args;
        const file = this.node(this.resolve(filename));
        
        if (!file) {
            return this.echo(`chmod: cannot access '${filename}': No such file or directory`, "error");
        }
        
        if (file.owner !== this.user && !this.isRoot) {
            return this.echo(`chmod: changing permissions of '${filename}': Operation not permitted`, "error");
        }
        
        if (!/^[0-7]{3}$/.test(perms)) {
            return this.echo("chmod: invalid mode", "error");
        }
        
        file.permissions = perms;
        this.echo(`Changed permissions of '${filename}' to ${perms}`, "success");
    }

    /* ========= Directory Commands ========= */
    cmdTree(args) {
        const startPath = args[0] || this.cwd;
        this.echo(startPath);
        this.printTree(startPath, "", true);
    }

    printTree(path, prefix = "", isLast = true) {
        const node = this.node(path);
        if (!node || node.type !== "dir") return;
        
        const entries = Object.keys(node.contents);
        entries.forEach((name, index) => {
            const isLastEntry = index === entries.length - 1;
            const symbol = isLastEntry ? "└── " : "├── ";
            this.echo(prefix + symbol + name);
            
            const childPath = path === "/" ? `/${name}` : `${path}/${name}`;
            if (node.contents[name].type === "dir") {
                const newPrefix = prefix + (isLastEntry ? "    " : "│   ");
                this.printTree(childPath, newPrefix, isLastEntry);
            }
        });
    }

    cmdDu(args) {
        const path = args[0] || this.cwd;
        const size = this.calculateSize(path);
        this.echo(`${size}K\t${path}`);
    }

    calculateSize(path) {
        const node = this.node(path);
        if (!node) return 0;
        
        if (node.type === "file") {
            return Math.ceil((node.size || 0) / 1024);
        }
        
        let total = 1; // Directory itself
        Object.keys(node.contents).forEach(name => {
            const childPath = path === "/" ? `/${name}` : `${path}/${name}`;
            total += this.calculateSize(childPath);
        });
        
        return total;
    }

    /* ========= System Info Commands ========= */
    cmdPs(args) {
        this.echo("PID   USER     COMMAND");
        this.processes.forEach(proc => {
            const pidStr = proc.pid.toString().padEnd(5);
            const userStr = proc.user.padEnd(8);
            this.echo(`${pidStr} ${userStr} ${proc.command}`);
        });
    }

    cmdKill(args) {
        const pid = parseInt(args[0]);
        if (!pid) {
            return this.echo("Usage: kill <pid>", "error");
        }
        
        const process = this.processes.get(pid);
        if (!process) {
            return this.echo(`kill: no process with pid ${pid}`, "error");
        }
        
        if (process.user !== this.user && !this.isRoot) {
            return this.echo(`kill: cannot kill process ${pid}: Permission denied`, "error");
        }
        
        this.killProcess(pid);
        this.echo(`Terminated process ${pid}`, "success");
    }

    cmdDf() {
        this.echo("Filesystem     1K-blocks    Used Available Use% Mounted on");
        this.echo("/dev/sda1        1000000  750000    250000  75% /");
        this.echo("tmpfs             500000   50000    450000  10% /tmp");
    }

    cmdFree() {
        this.echo("              total        used        free      shared  buff/cache   available");
        this.echo("Mem:        8000000     4000000     2000000      100000     2000000     3800000");
        this.echo("Swap:       2000000      200000     1800000");
    }

    cmdUptime() {
        const now = new Date();
        const uptime = Math.floor((now - this.systemUptime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        this.echo(`up ${hours}:${minutes.toString().padStart(2, '0')}, load average: 0.15, 0.25, 0.30`);
    }

    cmdHistory() {
        this.history.forEach((cmd, index) => {
            this.echo(`${(index + 1).toString().padStart(4)} ${cmd}`);
        });
    }

    cmdUsers() {
        this.echo(Object.keys(this.users).join(" "));
    }

    cmdGroups() {
        this.echo(`${this.user} : ${this.user} users`);
    }

    /* ========= Network Commands ========= */
    async cmdPing(args) {
        const host = args[0] || "localhost";
        this.echo(`PING ${host} (127.0.0.1): 56 data bytes`);
        
        for (let i = 0; i < 4; i++) {
            const time = (Math.random() * 50 + 10).toFixed(1);
            this.echo(`64 bytes from 127.0.0.1: icmp_seq=${i + 1} time=${time} ms`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        this.echo(`--- ${host} ping statistics ---`);
        this.echo("4 packets transmitted, 4 received, 0% packet loss");
    }

    cmdWget(args) {
        const url = args[0];
        if (!url) {
            return this.echo("Usage: wget <url>", "error");
        }
        
        this.echo(`Connecting to ${url}...`);
        this.echo("200 OK");
        this.echo("Length: 1024 (1.0K) [text/html]");
        this.echo("Saving to: 'index.html'");
        this.echo("index.html saved [1024/1024]");
        
        // Simulate creating the file
        this.cmdTouch(["index.html"]);
    }

    cmdCurl(args) {
        const url = args[0];
        if (!url) {
            return this.echo("Usage: curl <url>", "error");
        }
        
        this.echo("<!DOCTYPE html>");
        this.echo("<html><head><title>Example</title></head>");
        this.echo("<body><h1>Example Page</h1></body></html>");
    }

    /* ========= Basic Commands (Enhanced) ========= */
    cmdDate() {
        this.echo(new Date().toString());
    }

    cmdLs(flags) {
        const long = flags.includes("-l");
        const all = flags.includes("-a");
        const human = flags.includes("-h");
        
        const dir = this.node(this.cwd);
        if (!dir || dir.type !== "dir") return this.echo("Invalid directory");
        
        if (!this.hasPermission(dir, "read")) {
            return this.echo("ls: Permission denied", "error");
        }
        
        const names = Object.keys(dir.contents);
        if (!all) {
            names.filter(name => !name.startsWith("."));
        }
        
        if (!names.length) return;
        
        if (long) {
            this.echo("total " + names.length);
        }
        
        names.forEach(name => {
            if (!all && name.startsWith(".")) return;
            
            const node = dir.contents[name];
            if (long) {
                const type = node.type === "dir" ? "d" : "-";
                const perms = node.permissions || "644";
                const owner = (node.owner || "user").padEnd(8);
                const group = (node.group || "user").padEnd(8);
                const size = human ? this.humanSize(node.size || 0) : (node.size || 0).toString();
                const date = (node.modified || node.created || new Date()).toLocaleDateString();
                
                this.echo(`${type}${perms} 1 ${owner} ${group} ${size.padStart(8)} ${date} ${name}`);
            } else {
                const color = node.type === "dir" ? "info" : "";
                this.echo(name, color);
            }
        });
    }

    humanSize(bytes) {
        const units = ['B', 'K', 'M', 'G'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return size.toFixed(1) + units[unitIndex];
    }

    cmdCd(args) {
        const path = args[0] || this.users[this.user].home;
        const dest = this.resolve(path);
        const node = this.node(dest);
        
        if (node && node.type === "dir") {
            if (this.hasPermission(node, "execute")) {
                this.cwd = dest;
                this.updatePrompt();
            } else {
                this.echo("cd: Permission denied", "error");
            }
        } else {
            this.echo("cd: no such directory", "error");
        }
    }

    cmdMkdir(args) {
        if (!args.length) return this.echo("mkdir: missing operand", "error");
        
        args.forEach(name => {
            const target = this.resolve(name);
            const parentPath = target.replace(/\/[^/]+$/, "") || "/";
            const parent = this.node(parentPath);
            
            if (!parent || parent.type !== "dir") {
                return this.echo(`mkdir: cannot create directory '${name}': Invalid path`, "error");
            }
            
            if (!this.hasPermission(parent, "write")) {
                return this.echo(`mkdir: cannot create directory '${name}': Permission denied`, "error");
            }
            
            const base = name.split("/").pop();
            if (parent.contents[base]) {
                return this.echo(`mkdir: cannot create directory '${name}': File exists`, "error");
            }
            
            parent.contents[base] = {
                type: "dir",
                owner: this.user,
                group: this.user,
                permissions: "755",
                contents: {},
                created: new Date(),
                modified: new Date()
            };
        });
    }

    cmdTouch(args) {
        if (!args.length) return this.echo("touch: missing file operand", "error");
        
        args.forEach(name => {
            const path = this.resolve(name);
            const parentPath = path.replace(/\/[^/]+$/, "") || "/";
            const parent = this.node(parentPath);
            const base = name.split("/").pop();
            
            if (!parent) return this.echo(`touch: cannot touch '${name}': Invalid path`, "error");
            
            if (!this.hasPermission(parent, "write")) {
                return this.echo(`touch: cannot touch '${name}': Permission denied`, "error");
            }
            
            if (parent.contents[base] && parent.contents[base].type === "file") {
                parent.contents[base].modified = new Date();
            } else {
                parent.contents[base] = {
                    type: "file",
                    owner: this.user,
                    group: this.user,
                    permissions: "644",
                    content: "",
                    size: 0,
                    created: new Date(),
                    modified: new Date()
                };
            }
        });
    }

    cmdCat(args) {
        if (!args.length) return this.echo("cat: missing file operand", "error");
        
        args.forEach(name => {
            const file = this.node(this.resolve(name));
            if (!file || file.type !== "file") {
                return this.echo(`cat: ${name}: No such file or directory`, "error");
            }
            
            if (!this.hasPermission(file, "read")) {
                return this.echo(`cat: ${name}: Permission denied`, "error");
            }
            
            this.echo(file.content || "");
        });
    }

    cmdRm(args) {
        if (!args.length) return this.echo("rm: missing operand", "error");
        
        args.forEach(name => {
            const path = this.resolve(name);
            const parentPath = path.replace(/\/[^/]+$/, "") || "/";
            const parent = this.node(parentPath);
            const base = name.split("/").pop();
            
            if (!parent?.contents?.[base]) {
                return this.echo(`rm: cannot remove '${name}': No such file or directory`, "error");
            }
            
            const file = parent.contents[base];
            if (file.type !== "file") {
                return this.echo(`rm: cannot remove '${name}': Is a directory`, "error");
            }
            
            if (!this.hasPermission(parent, "write") || (file.owner !== this.user && !this.isRoot)) {
                return this.echo(`rm: cannot remove '${name}': Permission denied`, "error");
            }
            
            delete parent.contents[base];
        });
    }

    cmdRmdir(args) {
    if (!args.length) return this.echo("rmdir: missing operand", "error");

    for (const name of args) {
        const path = this.resolve(name);
        const dir = this.node(path);

        if (!dir || dir.type !== "dir") {
            return this.echo(`rmdir: failed to remove '${name}': No such directory`, "error");
        }

        if (Object.keys(dir.contents).length) {
            return this.echo(`rmdir: failed to remove '${name}': Directory not empty`, "error");
        }

        if (dir.owner !== this.user && !this.isRoot) {
            return this.echo(`rmdir: failed to remove '${name}': Permission denied`, "error");
        }

        const parentPath = path.replace(/\/[^/]+$/, "") || "/";
        const base = name.split("/").pop();
        delete this.node(parentPath).contents[base];
    }
}


    cmdClear() {
        this.$output.innerHTML = "";
    }

    cmdHelp() {
        this.echo(`Enhanced Terminal Commands:

System Commands:
  shutdown [-h] [time]  - Shutdown system
  reboot                - Restart system  
  passwd [user]         - Change password
  su [user]             - Switch user
  sudo <command>        - Run as superuser
  exit                  - Exit current session

File Operations:
  nano/vim <file>       - Edit file
  cp <src> <dest>       - Copy files
  mv <src> <dest>       - Move/rename files
  find <path> -name <pattern> - Find files
  grep <pattern> <file> - Search in files
  head [-n num] <file>  - Show first lines
  tail [-n num] <file>  - Show last lines
  wc <file>             - Count words/lines/chars
  chmod <perms> <file>  - Change permissions

Directory Operations:
  tree [path]           - Show directory tree
  du [path]             - Show disk usage

System Information:
  ps [aux]              - Show processes
  kill <pid>            - Terminate process
  df                    - Show disk space
  free                  - Show memory usage
  uptime                - Show system uptime
  history               - Command history
  users                 - List users
  groups                - Show groups

Network:
  ping <host>           - Ping host
  wget <url>            - Download file
  curl <url>            - HTTP request

Basic Commands:
  ls [-l -a -h]         - List files
  cd [path]             - Change directory
  pwd                   - Show current directory
  mkdir <dir>           - Create directory
  touch <file>          - Create/update file
  cat <file>            - Show file content
  rm <file>             - Remove file
  rmdir <dir>           - Remove directory
  clear                 - Clear screen
  date                  - Show date/time
  whoami                - Show current user
  echo <text>           - Print text
  help                  - Show this help

Tips:
- Use Tab for autocompletion
- Use Up/Down arrows for command history
- Use Ctrl+C to cancel current input
- Use Ctrl+L to clear screen
- Default passwords: user123, root123

Voice Commands Click 🎤 or press Ctrl+Space:
- "user manual or help" -> help
- "date or todays date" -> date
- "list files" → ls -la
- "change directory to [name]" → cd [name]
- "create directory [name]" → mkdir [name]
- "create file [name]" → touch [name]
- "edit file [name]" → nano [name]
- "show file content [file name] -> cat [name]
- "delete file [name]" → rm [name]
- "clear screen" → clear
- "show current directory" → pwd
- "show history" → history
- "who am i" → whoami
Or speak any terminal command directly!
`);
    }

    /* ========= Autocomplete ========= */
    autocomplete(current) {
        if (!current) return;
        
        const parts = current.split(/\s+/);
        if (parts.length === 1) {
            const cmds = [
                "date", "ls", "pwd", "cd", "mkdir", "touch", "cat", "rm", "rmdir", "clear",
                "whoami", "uname", "echo", "help", "shutdown", "reboot", "passwd", "su",
                "sudo", "exit", "nano", "vim", "cp", "mv", "find", "grep", "head", "tail",
                "wc", "chmod", "tree", "du", "ps", "kill", "df", "free", "uptime", "history",
                "users", "groups", "ping", "wget", "curl"
            ];
            const hits = cmds.filter(c => c.startsWith(parts[0]));
            if (hits.length === 1) this.$input.value = hits + " ";
        } else {
            // Path completion
            const path = parts.pop();
            const baseDir = path.includes("/")
                ? this.resolve(path.replace(/\/[^/]+$/, "") || "/")
                : this.cwd;
            const node = this.node(baseDir);
            if (!node) return;
            
            const prefix = path.split("/").pop() || "";
            const hits = Object.keys(node.contents)
                .filter(n => n.startsWith(prefix));
            
            if (hits.length === 1) {
                const pathPrefix = path.includes("/") ? path.replace(/\/[^/]+$/, "/") : "";
                parts.push(pathPrefix + hits[0]);
                this.$input.value = parts.join(" ") + " ";
            }
        }
    }
}

/* ========= Boot Enhanced Terminal ========= */
window.addEventListener("DOMContentLoaded", () => {
    new EnhancedTerminal();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
