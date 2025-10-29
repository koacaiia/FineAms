const XLSX = require('xlsx');
const fs = require('fs');

// Excel 파일 읽기
const workbook = XLSX.readFile('amsForm.xls');

// 첫 번째 시트 선택
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// HTML로 변환 (테이블만)
const htmlFull = XLSX.utils.sheet_to_html(worksheet, {
    id: "amsFormTable",
    editable: false
});

// <body> 태그 안의 <table>만 추출
const tableMatch = htmlFull.match(/<table[^>]*>[\s\S]*<\/table>/i);
const tableHtml = tableMatch ? tableMatch[0] : '<p>테이블을 찾을 수 없습니다.</p>';

// 완전한 HTML 문서 생성
const fullHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AmsForm - Converted from Excel</title>
    <style>
        body {
            font-family: "Malgun Gothic", "맑은 고딕", Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        #amsFormTable {
            background-color: white;
            border-collapse: collapse;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        #amsFormTable td, #amsFormTable th {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            min-width: 40px;
        }
        #amsFormTable tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        #amsFormTable tr:hover {
            background-color: #f0f0f0;
        }
        h1 {
            text-align: center;
            color: #333;
            max-width: 1200px;
            margin: 20px auto;
        }
        .info {
            max-width: 1200px;
            margin: 10px auto;
            padding: 10px;
            background: #e8f4f8;
            border-left: 4px solid #2196F3;
        }
    </style>
</head>
<body>
    <h1>AmsForm - Excel 변환</h1>
    <div class="info">
        <strong>📊 시트 이름:</strong> ${sheetName}
    </div>
    ${tableHtml}
    <script>
        console.log('Excel 파일이 HTML로 변환되었습니다.');
        console.log('시트:', '${sheetName}');
    </script>
</body>
</html>`;

// 파일로 저장
fs.writeFileSync('amsForm.converted.html', fullHtml, 'utf8');

console.log('✅ 변환 완료: amsForm.converted.html');
console.log(`📊 시트 이름: ${sheetName}`);
console.log(`📄 파일 크기: ${fullHtml.length} bytes`);
