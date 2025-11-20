import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname, extname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertTsToJs(content) {
	// Remove import type statements (keep regular imports)
	content = content.replace(/import\s+type\s+([^;]+);/g, '');
	
	// Remove type annotations from function parameters and return types
	content = content.replace(/:\s*[A-Za-z0-9_$<>\[\]|&\s,?]+(?=\s*[={)])/g, '');
	
	// Remove type annotations from variables
	content = content.replace(/:\s*[A-Za-z0-9_$<>\[\]|&\s,?]+(?=\s*[=;])/g, '');
	
	// Remove interface definitions
	content = content.replace(/export\s+interface\s+\w+[^{]*\{[^}]*\}/gs, '');
	content = content.replace(/interface\s+\w+[^{]*\{[^}]*\}/gs, '');
	
	// Remove export type statements
	content = content.replace(/export\s+type\s+\{[^}]+\}\s+from\s+['"][^'"]+['"];?/g, '');
	
	// Remove type assertions (as Type)
	content = content.replace(/\s+as\s+[A-Za-z0-9_$<>\[\]|&\s,]+/g, '');
	
	// Remove generic type parameters from function calls/declarations
	content = content.replace(/<[A-Za-z0-9_$<>\[\]|&\s,]+>/g, '');
	
	// Remove any remaining type annotations in object destructuring
	content = content.replace(/\{\s*([^}]+)\s*\}\s*:\s*[A-Za-z0-9_$<>\[\]|&\s,]+/g, '{$1}');
	
	// Clean up multiple blank lines
	content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
	
	return content;
}

function findTsFiles(dir, fileList = []) {
	const files = readdirSync(dir);
	
	files.forEach(file => {
		const filePath = join(dir, file);
		const stat = statSync(filePath);
		
		if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.svelte-kit')) {
			findTsFiles(filePath, fileList);
		} else if (extname(file) === '.ts' && !file.endsWith('.d.ts')) {
			fileList.push(filePath);
		}
	});
	
	return fileList;
}

const srcDir = join(__dirname, 'src');
const tsFiles = findTsFiles(srcDir);

console.log(`Found ${tsFiles.length} TypeScript files to convert`);

tsFiles.forEach(tsFile => {
	try {
		const content = readFileSync(tsFile, 'utf-8');
		const jsContent = convertTsToJs(content);
		const jsFile = tsFile.replace(/\.ts$/, '.js');
		
		writeFileSync(jsFile, jsContent, 'utf-8');
		console.log(`Converted: ${tsFile} -> ${jsFile}`);
	} catch (error) {
		console.error(`Error converting ${tsFile}:`, error.message);
	}
});

console.log('Conversion complete!');

