/* eslint-disable */
require("script-loader!file-saver");
//require("script-loader!./Blob.js");
require("script-loader!xlsx-style/dist/xlsx.core.min");

function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll("tr");
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll("td");
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute("colspan");
      var rowspan = cell.getAttribute("rowspan");
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function(range) {
        if (
          R >= range.s.r &&
          R <= range.e.r &&
          outRow.length >= range.s.c &&
          outRow.length <= range.e.c
        ) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        });
      }

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
}

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, types) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  // data["B1"] = { t: "s", v: "asdad" };
  // data["!merges"] = [{//合并第一行数据[B1,C1,D1,E1]
  //     s: {//s为开始
  //         c: 1,//开始列
  //         r: 0//开始取值范围
  //     },
  //     e: {//e结束
  //         c: 4,//结束列
  //         r: 0//结束范围
  //     }
  // }];
  for (var R = 0; R != data.length; ++R) {
    if (range.s.r > R) range.s.r = R;
    if (range.e.r < R) range.e.r = R;
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.c > C) range.s.c = C;
      if (range.e.c < C) range.e.c = C;
      var cell = {
        v: data[R][C]
      };
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({
        c: C,
        r: R
      });

      var cellStyle = {
        font: {
          name: "Microsoft Yahei"
          //name:'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif',
        }
      };
      if (R == 0) {
        //首行
        cellStyle.fill = {
          bgColor: {
            indexed: 64
          },
          fgColor: {
            rgb: "9bbcf7"
          }
        };
        cellStyle.font.bold = true;
      } else {
        try {
          var type = types[C];
          if (type == "n" && !isNaN(cell.v)) {
            cell.t = "n";
            cell.v = Number(cell.v);
          } else if (typeof cell.v === "number") cell.t = "n";
          else if (typeof cell.v === "boolean") cell.t = "b";
          else if (cell.v instanceof Date) {
            cell.t = "n";
            cell.z = XLSX.SSF._table[14];
            cell.v = datenum(cell.v);
          } else cell.t = "s";
        } catch (ex) {
          cell.t = "s";
          console.error(ex);
        }
      }
      ws[cell_ref] = cell;
      ws[cell_ref].s = cellStyle;
    }
  }
  if (range.s.c < 10000000) ws["!ref"] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws["!merges"] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: false,
    type: "binary"
  });

  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    "test.xlsx"
  );
}

function formatJson(jsonData) {
  console.log(jsonData);
}
/**
 * 导出的字段类型
 * @param {*} th
 * @param {*} jsonData
 * @param {*} defaultTitle
 * @param {*} types
 */
export function export_json_to_excel(th, jsonData, defaultTitle, types) {
  /* original data */

  var data = jsonData;
  data.unshift(th);
  var ws_name = defaultTitle || "主数据列表";

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data, types);

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: false,
    type: "binary"
  });
  var title = defaultTitle || "列表";
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    title + ".xlsx"
  );
}

/**
 * 导出excel
 * @param sheets
 * @param excelTitle
 */
export function export_sheets_to_excel(sheets, excelTitle) {
  var wb = new Workbook();
  //var me = this;
  sheets.forEach(function(sheetConfig) {
    /* original data */
    var data = sheetConfig.jsonData;
    data.unshift(sheetConfig.th);
    var ws_name = sheetConfig.defaultTitle || "主数据列表";
    var ws = sheet_from_array_of_arrays(data, sheetConfig.types);
    /* add worksheet to workbook */
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
  });
  var wbout = XLSX.write(wb, {
    bookType: "xlsx",
    bookSST: false,
    type: "binary"
  });
  var title = excelTitle || "列表";
  saveAs(
    new Blob([s2ab(wbout)], {
      type: "application/octet-stream"
    }),
    title + ".xlsx"
  );
}
