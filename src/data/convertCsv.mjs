import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to the original CSV files
const leaderboardPath = path.resolve(__dirname, '../../../Round1Qualifiers/leaderboard_export.csv');
const qualifiersPath = path.resolve(__dirname, '../../../Round1Qualifiers/Round1Qualifiers.csv');

// Paths for output JSON files
const leaderboardOutPath = path.resolve(__dirname, 'leaderboard.json');
const qualifiersOutPath = path.resolve(__dirname, 'qualifiers.json');

function parseAndSanitize(csvPath, outPath) {
    if (!fs.existsSync(csvPath)) {
        console.error(`File not found: ${csvPath}`);
        return;
    }
    
    const fileContent = fs.readFileSync(csvPath, 'utf8');
    const parsed = Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
    });
    
    if (parsed.errors.length > 0) {
        console.error(`Errors parsing ${csvPath}:`, parsed.errors);
    }
    
    const sanitizedData = parsed.data.map(row => {
        const { Email, 'Contact No': ContactNo, ...rest } = row;
        return rest;
    });
    
    fs.writeFileSync(outPath, JSON.stringify(sanitizedData, null, 2), 'utf8');
    console.log(`Successfully converted and sanitized ${path.basename(csvPath)} to ${path.basename(outPath)}`);
}

parseAndSanitize(leaderboardPath, leaderboardOutPath);
parseAndSanitize(qualifiersPath, qualifiersOutPath);
