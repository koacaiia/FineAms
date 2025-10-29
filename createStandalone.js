const fs = require('fs');
const path = require('path');

// 파일 읽기
const stylesheet = fs.readFileSync('amsForm.files/stylesheet.css', 'utf8');
const sheet001 = fs.readFileSync('amsForm.files/sheet001.htm', 'utf8');

// Base64 이미지 읽기
const image001 = fs.readFileSync('amsForm.files/image001.b64', 'utf8').trim();
const image003 = fs.readFileSync('amsForm.files/image003.b64', 'utf8').trim();
const image005 = fs.readFileSync('amsForm.files/image005.b64', 'utf8').trim();
const image006 = fs.readFileSync('amsForm.files/image006.b64', 'utf8').trim();

// sheet001.htm의 내용에서 stylesheet와 이미지 링크를 인라인으로 변경
let modifiedSheet = sheet001;

// 1. <link rel=Stylesheet href=stylesheet.css> 를 <style> 태그로 교체
modifiedSheet = modifiedSheet.replace(
    /<link rel=Stylesheet href=stylesheet\.css>/,
    `<style>\n${stylesheet}\n</style>`
);

// 2. 이미지 src를 base64로 교체 (img 태그와 VML v:imagedata 모두)
modifiedSheet = modifiedSheet.replace(/src="?image001\.png"?/g, `src="data:image/png;base64,${image001}"`);
modifiedSheet = modifiedSheet.replace(/src="?image003\.png"?/g, `src="data:image/png;base64,${image003}"`);
modifiedSheet = modifiedSheet.replace(/src="?image005\.png"?/g, `src="data:image/png;base64,${image005}"`);
modifiedSheet = modifiedSheet.replace(/src="?image006\.png"?/g, `src="data:image/png;base64,${image006}"`);

// VML v:imagedata의 src 속성도 교체
modifiedSheet = modifiedSheet.replace(/src="image001\.png"/gi, `src="data:image/png;base64,${image001}"`);
modifiedSheet = modifiedSheet.replace(/src="image003\.png"/gi, `src="data:image/png;base64,${image003}"`);
modifiedSheet = modifiedSheet.replace(/src="image005\.png"/gi, `src="data:image/png;base64,${image005}"`);
modifiedSheet = modifiedSheet.replace(/src="image006\.png"/gi, `src="data:image/png;base64,${image006}"`);

// 따옴표 없는 형태도 교체 (속성값에 따옴표가 없는 경우)
modifiedSheet = modifiedSheet.replace(/src=image001\.png/gi, `src="data:image/png;base64,${image001}"`);
modifiedSheet = modifiedSheet.replace(/src=image003\.png/gi, `src="data:image/png;base64,${image003}"`);
modifiedSheet = modifiedSheet.replace(/src=image005\.png/gi, `src="data:image/png;base64,${image005}"`);
modifiedSheet = modifiedSheet.replace(/src=image006\.png/gi, `src="data:image/png;base64,${image006}"`);

// 3. 불필요한 링크 제거
modifiedSheet = modifiedSheet.replace(/<link id=Main-File rel=Main-File href="\.\.\/amsForm\.htm">/, '');
modifiedSheet = modifiedSheet.replace(/<link rel=File-List href=filelist\.xml>/, '');

// 4. 프레임 리다이렉트 제거
modifiedSheet = modifiedSheet.replace(/if \(window\.name!="frSheet"\)\s+window\.location\.replace\("\.\.\/amsForm\.htm"\);/, '');
modifiedSheet = modifiedSheet.replace(/else\s+fnUpdateTabs\(\);/, '');

// 5. charset을 utf-8로 변경
modifiedSheet = modifiedSheet.replace(/charset=ks_c_5601-1987/, 'charset=utf-8');

// 6. title 추가
modifiedSheet = modifiedSheet.replace(/<title><\/title>/, '<title>AmsForm - Standalone</title>');

// 파일 저장
fs.writeFileSync('amsForm.standalone.html', modifiedSheet, 'utf8');

console.log('✅ Standalone HTML 생성 완료: amsForm.standalone.html');
console.log('📄 파일 크기:', Math.round(modifiedSheet.length / 1024), 'KB');
console.log('🎨 CSS 인라인 완료');
console.log('🖼️  이미지 4개 base64 인라인 완료');
