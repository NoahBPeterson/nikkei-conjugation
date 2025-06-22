const fs = require('fs');
const convert = require('xml-js');
const zlib = require('zlib');

const JMDictPath = 'JMdict_e.xml';
const jsonOutputPath = 'verbs.json';
const gzipOutputPath = 'verbs.json.gz';

console.log(`Starting build process...`);

if (!fs.existsSync(JMDictPath)) {
    console.error(`Error: ${JMDictPath} not found.`);
    console.error("Please download it from https://www.edrdg.org/jmdict/j_jmdict.html and place it in the root directory.");
    process.exit(1);
}

console.log(`Reading ${JMDictPath}...`);
const xmlFile = fs.readFileSync(JMDictPath, 'utf8');

console.log("Pre-processing XML to remove non-standard entities...");

// This new, more robust method protects standard XML entities,
// removes all other custom entities, then restores the standard ones.
const placeholders = {
    '__AMP__': /&amp;/g,
    '__LT__': /&lt;/g,
    '__GT__': /&gt;/g,
    '__QUOT__': /&quot;/g,
    '__APOS__': /&apos;/g,
};

// 1. Protect standard entities
let sanitizedXml = xmlFile;
for (const placeholder in placeholders) {
    sanitizedXml = sanitizedXml.replace(placeholders[placeholder], placeholder);
}

// 2. Remove all other custom entities (like &product;, &v1;, etc.)
sanitizedXml = sanitizedXml.replace(/&([a-zA-Z0-9\-_.]+);/g, "$1");

// 3. Restore standard entities
for (const placeholder in placeholders) {
    sanitizedXml = sanitizedXml.replace(new RegExp(placeholder, 'g'), (match) => {
        // This is a bit verbose, but it maps the placeholder back to the original entity string
        // e.g., '__AMP__' becomes '&amp;'
        return `&${placeholder.replace(/__/g, '').toLowerCase()};`;
    });
}

console.log("Converting XML to JavaScript object... (This may take a moment)");
const jmdictObj = convert.xml2js(sanitizedXml, { compact: true });

console.log("Parsing entries and extracting verbs...");
const verbs = [];
const verbPOSTags = [
    'v1', 'v2a-s', 'v4h', 'v4r', 'v5', 'v5aru', 'v5b', 'v5g', 'v5k', 'v5k-s',
    'v5m', 'v5n', 'v5r', 'v5r-i', 'v5s', 'v5t', 'v5u', 'v5u-s', 'v5uru', 'v5z',
    'vz', 'vi', 'vk', 'vn', 'vr', 'vs', 'vs-s', 'vs-i', 'vt', 'aux-v'
];

const entries = jmdictObj.JMdict.entry;

function getVerbType(posTags, reading) {
    if (!reading) return null;
    if (posTags.includes("v1") || posTags.includes("vz")) return "ichidan";
    if (posTags.some(p => p && p.startsWith("v5"))) {
        const ending = reading.slice(-1);
        if ("うくぐすつぬぶむる".includes(ending)) {
            return `godan-${ending}`;
        }
        return null;
    }
    if (posTags.some(p => p && p.startsWith("vs"))) return "suru";
    if (posTags.includes("vk")) return "kuru";
    return null;
}

for (const entry of entries) {
    const senses = Array.isArray(entry.sense) ? entry.sense : [entry.sense];

    for (const sense of senses) {
        if (!sense.pos) continue;
        const posElements = Array.isArray(sense.pos) ? sense.pos : [sense.pos];
        const posTags = posElements.map(p => p._text).filter(Boolean);

        const foundVerbTags = posTags.filter(pt => verbPOSTags.includes(pt));

        if (foundVerbTags.length > 0) {
            const rebElements = Array.isArray(entry.r_ele) ? entry.r_ele : [entry.r_ele];
            const kebElements = Array.isArray(entry.k_ele) ? entry.k_ele : [entry.k_ele];

            if (rebElements[0] && rebElements[0].reb && sense.gloss) {
                const reading = rebElements[0].reb._text;
                const kanji = (kebElements[0] && kebElements[0].keb) ? kebElements[0].keb._text : reading;
                const verbType = getVerbType(foundVerbTags, reading);
                const glosses = Array.isArray(sense.gloss) ? sense.gloss : [sense.gloss];
                const english = glosses[0]._text || '';

                if (verbType) {
                    verbs.push({
                        kanji,
                        reading,
                        english: english.split(';')[0],
                        type: verbType,
                        dictForm: kanji || reading,
                    });
                    break; // Move to the next entry once a verb sense is found
                }
            }
        }
    }
}

console.log(`Found and processed ${verbs.length} verbs.`);
console.log(`Writing to ${jsonOutputPath}...`);

fs.writeFileSync(jsonOutputPath, JSON.stringify(verbs));

console.log('Compressing verbs.json...');
const jsonFile = fs.readFileSync(jsonOutputPath);
const compressed = zlib.gzipSync(jsonFile);
fs.writeFileSync(gzipOutputPath, compressed);
console.log(`Successfully created compressed file: ${gzipOutputPath}`);

console.log(`Build complete! ${jsonOutputPath} and ${gzipOutputPath} have been created.`); 