// Prompt for the AI
const SYSTEM_PROMPT = `You are an expert business communications and recruitment email assistant.

Your role is to write professional, human-sounding emails for recruiters, staffing firms, hiring managers, and business professionals.

Rules:
1. Always generate a compelling subject line and a complete email body.
2. The email must sound like it was written by a real person — clear, concise, and professional.
3. Include all provided key points naturally.
4. Address the recipient using their name exactly as provided. If a title (Dr., Prof., etc.) is already included, use it as-is. Do not add titles like Mr./Ms. or shorten to last name only unless explicitly provided.
5. Match the requested tone exactly.
6. Avoid clichés: "I hope this email finds you well", "Trust you are doing great", "Hope you're having a wonderful day".
7. Avoid unnecessary filler text and generic AI-sounding language.
8. Never use markdown formatting — no bold, no bullet points, no asterisks, no headers inside the email body.
9. If information is incomplete — use neutral wording. Never invent facts, dates, links, or commitments.

Length requirements:
- Concise: 3-4 short sentences only.
- Standard: 1-2 short paragraphs.
- Detailed: Multiple well-structured paragraphs with context.

Tone requirements:
- Professional: Businesslike and respectful.
- Friendly: Warm and approachable.
- Formal: Corporate and polished, no contractions.
- Assertive: Direct, confident, and action-oriented.

Return output ONLY in this format:
Subject: <subject line>

Email: <email body>`;

// Pre-built templates
const templates = {
    interview: { 
        purpose: "Interview Scheduling",
        recipient: "",
        keypoints: "Interview on Monday\n11 AM\nMicrosoft Teams link to follow", 
        tone: "Professional", 
        length: "Standard" 
    },

    offer: {
        purpose: "Offer Letter Follow-up",
        recipient: "",
        keypoints: "Following up on offer letter sent last week\nRequest confirmation by Friday\nOpen to discuss terms",
        tone: "Assertive",
        length: "Concise" 
    },
    
    client: { 
        purpose: "Client Status Update", 
        recipient: "", 
        keypoints: "Project is on track\nMilestone 2 completed\nNext review scheduled for next week", 
        tone: "Formal", 
        length: "Standard" },
};

// Stores last generation for refinement context
let conversationHistory = [];

// Runs when a template button is clicked
function loadTemplate(name) {
    const t = templates[name];
    document.getElementById('purpose').value = t.purpose;
    document.getElementById('recipient').value = t.recipient;
    document.getElementById('keypoints').value = t.keypoints;
    document.getElementById('tone').value = t.tone;
    document.getElementById('length').value = t.length;
}

// Maps length selection to token limit
function getMaxTokens(length) {
    const limits = { Concise: 200, Standard: 500, Detailed: 900 };
    return limits[length] || 500;
}

// Maps API status codes to user-facing error messages
function getErrorMessage(err) {
    if (!err.status) return 'No internet connection — check your network';
    const messages = {
        401: 'Invalid API key — check your config.js',
        429: 'Rate limit reached — wait a few seconds and try again',
        500: 'Groq server error — try again shortly'
    };
    return messages[err.status] || 'Something went wrong — please try again';
}

// Standalone API service function
async function callGroqAPI(messages, maxTokens) {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: messages,
            temperature: 0.7,
            max_tokens: maxTokens
        })
    });

    const data = await response.json();
    if (!response.ok) {
        const err = new Error(data.error?.message || 'API error');
        err.status = response.status;
        throw err;
    }
    return data.choices[0].message.content;
}

// Generate email function opening and validation
async function generateEmail(isRefine = false) {
    const purpose = document.getElementById('purpose').value.trim();
    const recipient = document.getElementById('recipient').value.trim();
    const keypoints = document.getElementById('keypoints').value.trim();
    const tone = document.getElementById('tone').value;
    const length = document.getElementById('length').value;
    const refine = document.getElementById('refine').value.trim();

    const errorDiv = document.getElementById('error-msg');
    errorDiv.textContent = '';

    if (!purpose || !recipient || !keypoints) {
        errorDiv.textContent = 'Please fill in all fields before generating.';
        return;
    }

    if (!isRefine) conversationHistory = [];

// Building the prompt & API call

    document.getElementById('body-output').innerHTML = '<div class="spinner"></div>';
    setLoading(true);

    // ---------- Userprompt ----------
    let userPrompt = `Generate a business email using the following information:

    Purpose:
    ${purpose}

    Recipient Name & Designation:
    ${recipient}

    Key Points:
    ${keypoints}

    Tone:
    ${tone}

    Length:
    ${length}

    Requirements:
    - Include every key point naturally.
    - Match the selected tone.
    - Follow the selected length.
    - Make the email sound authentic and written by a human.
    - Create a relevant and professional subject line.`;


    // ---------- Refinement Prompt ----------
    if (isRefine && refine) {
    userPrompt = `The previous email needs refinement.

    Refinement Request:
    ${refine}

    Keep:
    - Same purpose: ${purpose}
    - Same recipient: ${recipient}
    - Same key information: ${keypoints}

    Improve the email according to the refinement request while maintaining professionalism.
    Return a completely revised version, not minor wording changes.`;
    }

    try {
        const messages = isRefine && conversationHistory.length
            ? [{ role: 'system', content: SYSTEM_PROMPT }, ...conversationHistory, { role: 'user', content: userPrompt }]
            : [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userPrompt }];

        const maxTokens = getMaxTokens(length);
        const emailText = await callGroqAPI(messages, maxTokens);
        conversationHistory = [
            { role: 'user', content: userPrompt },
            { role: 'assistant', content: emailText }
        ];

        const subjectMatch = emailText.match(/Subject:\s*(.+)/i);
        const bodyMatch = emailText.match(/Email:\s*([\s\S]+)/i);

        const subject = subjectMatch ? subjectMatch[1].trim() : '';
        const body = bodyMatch
            ? bodyMatch[1].trim().replace(/^Subject:\s*.+\n?/i, '').trim()
            : emailText.replace(/Subject:\s*.+\n?/i, '').trim();

        if (subject) {
            document.getElementById('subject-output').textContent = subject;
            document.getElementById('subject-group').style.display = 'block';
        }
        document.getElementById('body-output').textContent = body;
        document.getElementById('body-output').classList.remove('placeholder');
        document.getElementById('copy-body-btn').style.display = 'block';
        document.getElementById('refine-group').style.display = 'block';
        const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
        document.getElementById('word-count').textContent = `${wordCount} words`;
         saveToHistory(subject, body, purpose);
        setLoading(false);

    } catch (err) {
        document.getElementById('body-output').innerHTML = `<span class="error">${getErrorMessage(err)}</span>`;
        setLoading(false);
    }
}

// copyField function

function copyField(fieldId, btn) {
    const text = document.getElementById(fieldId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = original, 2000);
    });
}

// Add helper functions to disable/enable buttons

function setLoading(isLoading) {
    document.getElementById('generate-btn').disabled = isLoading;
    const refineBtn = document.querySelector('#refine-group .btn-secondary');
    if (refineBtn) refineBtn.disabled = isLoading;
}

// Email history functions
function saveToHistory(subject, body, purpose) {
    try {
        const history = JSON.parse(localStorage.getItem('emailHistory') || '[]');
        history.unshift({ subject, body, purpose, timestamp: Date.now() });
        if (history.length > 5) history.pop();
        localStorage.setItem('emailHistory', JSON.stringify(history));
        renderHistory();
    } catch (e) {}
}

function escapeHTML(str) {
    return str.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
}

function renderHistory() {
    try {
        const history = JSON.parse(localStorage.getItem('emailHistory') || '[]');
        const panel = document.getElementById('history-panel');
        const list = document.getElementById('history-list');
        if (!history.length) { panel.style.display = 'none'; return; }
        panel.style.display = 'block';
        list.innerHTML = history.map((entry, i) => `
            <div class="history-entry" onclick="restoreFromHistory(${i})">
                <div class="entry-purpose">${escapeHTML(entry.purpose)}</div>
                <div class="entry-time">${timeAgo(entry.timestamp)}</div>
            </div>
        `).join('');
    } catch (e) {}
}

function restoreFromHistory(index) {
    try {
        const history = JSON.parse(localStorage.getItem('emailHistory') || '[]');
        const entry = history[index];
        if (!entry) return;
        document.getElementById('subject-output').textContent = entry.subject;
        document.getElementById('subject-group').style.display = entry.subject ? 'block' : 'none';
        document.getElementById('body-output').textContent = entry.body;
        document.getElementById('body-output').classList.remove('placeholder');
        document.getElementById('copy-body-btn').style.display = 'block';
    } catch (e) {}
}

function clearHistory() {
    try {
        localStorage.removeItem('emailHistory');
        renderHistory();
    } catch (e) {}
}

function timeAgo(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

// Render history on page load
renderHistory();

// Bulk mode state
let currentMode = 'single';
let bulkResults = [];

function switchMode(mode) {
    currentMode = mode;
    document.getElementById('single-mode-btn').classList.toggle('active', mode === 'single');
    document.getElementById('bulk-mode-btn').classList.toggle('active', mode === 'bulk');
    document.getElementById('single-recipient').style.display = mode === 'single' ? 'block' : 'none';
    document.getElementById('bulk-recipient').style.display = mode === 'bulk' ? 'block' : 'none';
    document.getElementById('output-panel').style.display = mode === 'single' ? 'block' : 'none';
    document.getElementById('bulk-results-panel').style.display = 'none';
    document.getElementById('refine-group').style.display = 'none';
    document.getElementById('error-msg').textContent = '';
    document.getElementById('generate-btn').textContent = mode === 'single' ? 'Generate Email' : 'Generate All Emails';
}

function handleGenerate() {
    if (currentMode === 'bulk') {
        generateBulk();
    } else {
        generateEmail();
    }
}

// Generating bulk emails
async function generateBulk() {
    const purpose = document.getElementById('purpose').value.trim();
    const keypoints = document.getElementById('keypoints').value.trim();
    const tone = document.getElementById('tone').value;
    const length = document.getElementById('length').value;
    const rawRecipients = document.getElementById('recipients-bulk').value.trim();

    const errorDiv = document.getElementById('error-msg');
    errorDiv.textContent = '';

    if (!purpose || !keypoints || !rawRecipients) {
        errorDiv.textContent = 'Please fill in all fields before generating.';
        return;
    }

    const recipients = rawRecipients.split('\n').map(r => r.trim()).filter(Boolean);
    if (recipients.length === 0) {
        errorDiv.textContent = 'Add at least one recipient.';
        return;
    }

    bulkResults = [];
    document.getElementById('bulk-results-panel').style.display = 'block';
    document.getElementById('bulk-list').innerHTML = '';
    document.getElementById('bulk-progress').style.display = 'block';
    document.getElementById('download-all-btn').style.display = 'none';
    setLoading(true);

    const maxTokens = getMaxTokens(length);

    for (let i = 0; i < recipients.length; i++) {
        const recipient = recipients[i];
        const percent = Math.round(((i) / recipients.length) * 100);
        document.getElementById('progress-bar').style.width = `${percent}%`;
        document.getElementById('progress-text').textContent = `Generating ${i + 1} of ${recipients.length}...`;

        const userPrompt = `Generate a business email using the following information:

    Purpose:
    ${purpose}

    Recipient Name & Designation:
    ${recipient}

    Key Points:
    ${keypoints}

    Tone:
    ${tone}

    Length:
    ${length}

    Requirements:
    - Include every key point naturally.
    - Match the selected tone.
    - Follow the selected length.
    - Make the email sound authentic and written by a human.
    - Create a relevant and professional subject line.`;

        try {
            const messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ];
            const emailText = await callGroqAPI(messages, maxTokens);

            const subjectMatch = emailText.match(/Subject:\s*(.+)/i);
            const bodyMatch = emailText.match(/Email:\s*([\s\S]+)/i);
            const subject = subjectMatch ? subjectMatch[1].trim() : '';
            const body = bodyMatch
                ? bodyMatch[1].trim().replace(/^Subject:\s*.+\n?/i, '').trim()
                : emailText.replace(/Subject:\s*.+\n?/i, '').trim();

            bulkResults.push({ recipient, subject, body, error: null });
        } catch (err) {
            bulkResults.push({ recipient, subject: '', body: '', error: getErrorMessage(err) });
        }

        renderBulkResults();

        if (i < recipients.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    document.getElementById('progress-bar').style.width = '100%';
    document.getElementById('progress-text').textContent = `Done — ${recipients.length} emails generated.`;
    document.getElementById('download-all-btn').style.display = 'inline-block';
    setLoading(false);
}

// Rendering Bulk emails

function renderBulkResults() {
    const list = document.getElementById('bulk-list');
    list.innerHTML = bulkResults.map((item, i) => {
        if (item.error) {
            return `
            <div class="bulk-item">
                <div class="bulk-item-header">
                    <div class="bulk-item-name">${escapeHTML(item.recipient)}</div>
                </div>
                <div class="error">${escapeHTML(item.error)}</div>
            </div>`;
        }
        return `
        <div class="bulk-item">
            <div class="bulk-item-header">
                <div class="bulk-item-name">${escapeHTML(item.recipient)}</div>
                <button class="btn-copy-small" onclick="copyBulkItem(${i}, this)">Copy</button>
            </div>
            <div class="bulk-item-subject">${escapeHTML(item.subject)}</div>
            <div class="bulk-item-body">${escapeHTML(item.body)}</div>
        </div>`;
    }).join('');
}

function copyBulkItem(index, btn) {
    const item = bulkResults[index];
    const text = `Subject: ${item.subject}\n\n${item.body}`;
    navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = original, 2000);
    });
}

function downloadAll() {
    const lines = bulkResults
        .filter(item => !item.error)
        .map(item => `To: ${item.recipient}\nSubject: ${item.subject}\n\n${item.body}`)
        .join('\n\n' + '='.repeat(60) + '\n\n');

    const blob = new Blob([lines], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-emails.txt';
    a.click();
    URL.revokeObjectURL(url);
}