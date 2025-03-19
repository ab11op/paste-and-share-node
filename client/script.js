const API_BASE = "http://localhost:4001/api";

// Initialize Quill.js Editor
var quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Start typing...',
    modules: {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['code-block'],  // Enable code blocks
            ['clean']
        ]
    }
});
async function createPaste() {
    const content = quill.root.innerHTML; // Get formatted content

    const response = await fetch(`${API_BASE}/paste`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
    });

    const data = await response.json();
    if (data.pasteId) {
        document.getElementById("pasteLink").innerHTML = `Paste URL: <a href="${API_BASE}/${data.pasteId}" target="_blank">${API_BASE}/${data.pasteId}</a>`;
    }
}

async function getPaste() {
    document.getElementById("getPasteBtn").addEventListener("click", async function () {
        const pasteId = document.getElementById("pasteIdInput").value.trim();
        
        if (!pasteId) {
            alert("Please enter a valid paste ID.");
            return;
        }
    
        try {
            const response = await fetch(`${API_BASE}/${pasteId}`);
    
            if (!response.ok) {
                throw new Error("Paste not found");
            }
    
            const html = await response.text(); // Get full HTML response
    
            // Create a temporary DOM parser
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
    
            // Extract content from textarea
            let pasteContent = doc.querySelector("textarea")?.textContent || "Error: No content found";
    
            // **Remove all HTML tags from content**
            pasteContent = pasteContent.replace(/<[^>]*>?/gm, ""); // ✅ Removes <p>, <b>, etc.
    
            // Display extracted plain text in the main textarea
            document.getElementById("pasteContent").value = pasteContent;
    
        } catch (error) {
            console.error("Error fetching paste:", error);
            alert("Error fetching paste. Please check the paste ID.");
        }
    });
    
    
}

// Handle File Uploads
async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files.length) return alert("Select a file!");

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData
    });

    const data = await response.json();
    if (data.fileUrl) {
        document.getElementById("fileLink").innerHTML = `File URL: <a href="${data.fileUrl}" target="_blank">${data.fileUrl}</a>`;

        const fileType = file.name.split('.').pop().toLowerCase();
        
        if (fileType === "txt") {
            fetch(data.fileUrl).then(res => res.text()).then(text => quill.root.innerHTML = `<pre>${text}</pre>`);
        } else if (fileType === "pdf") {
            displayPDF(data.fileUrl);
        } else if (fileType === "docx") {
            displayDocx(data.fileUrl);
        } else if (["png", "jpg", "jpeg"].includes(fileType)) {
            quill.root.innerHTML += `<img src="${data.fileUrl}" width="300">`;
        }
    }
}

function displayPDF(url) {
    pdfjsLib.getDocument(url).promise.then(pdf => {
        pdf.getPage(1).then(page => {
            page.getTextContent().then(textContent => {
                let extractedText = textContent.items.map(item => item.str).join(" ");
                quill.root.innerHTML = `<pre>${extractedText}</pre>`;
            });
        });
    });
}

function displayDocx(url) {
    fetch(url).then(res => res.arrayBuffer()).then(buffer => {
        mammoth.extractRawText({ arrayBuffer: buffer })
            .then(result => quill.root.innerHTML = `<pre>${result.value}</pre>`);
    });
}

function copyToClipboard() {
    const textArea = document.getElementById('pasteContent');
    const text = textArea.value;

    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Copied to clipboard!");
        })
        .catch(err => {
            console.error("Failed to copy: ", err);
        });
}
function formatText() {
    const textArea = document.getElementById('pasteContent');
    let content = textArea.value;

    try {
        // Try to parse and pretty-print JSON
        const jsonData = JSON.parse(content);
        textArea.value = JSON.stringify(jsonData, null, 4);
    } catch (error) {
        // If not JSON, just trim and clean extra spaces
        textArea.value = content.replace(/\s+/g, ' ').trim();
    }
}
