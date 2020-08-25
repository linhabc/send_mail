var filesystem = require("fs");
var request = require("request");
var exec = require("child_process").exec;

const util = require("util");

const readdir = util.promisify(filesystem.readdir);

var folders = [
  "../data/dothi.net/output",
  "../data/muaban.net/output",
  "../data/nhattao.com/output",
];

var total = 0;

var _getAllFilesFromFolder = async function (dir, folderIndex) {
  var results = [];

  var res = await readdir(dir);

  res.forEach(function (file, index, arr) {
    file = dir + "/" + file;
    var stat = filesystem.statSync(file);
    var regex = new RegExp("json$");

    if (!file.match(regex)) return;

    exec("wc -l " + file, function (_, result) {
      let num = result.split(" ")[0];
      total += parseInt(num);
      console.log(total);

      console.log(
        index + " " + arr.length + " " + folderIndex + " " + folders.length
      );

      // if (index == arr.length - 1 && folderIndex == folders.length - 1) {
      //   console.log("Sending mail with total: " + total);
      //   var options = {
      //     uri: "http://10.4.200.20:5005/api/v1/send-mail",
      //     method: "POST",
      //     json: {
      //       // send_to: "hau.nguyentat@mobifone.vn",
      //       send_to: "jonathanrocrach2@gmail.com",
      //       cc: "jonathanrocrach2@gmail.com",
      //       subject: "[Cảnh báo hệ thống]",
      //       content: "Total crawled phone numbers: " + total,
      //     },
      //   };
      //   request(options, function (error, response, body) {
      //     if (!error && response.statusCode == 200) {
      //       console.log(body);
      //     }
      //     if (error) console.log("error:" + error);
      //   });
      // }
    });

    if (stat && stat.isDirectory()) {
      results = results.concat(_getAllFilesFromFolder(file));
    } else results.push(file);
  });

  return results;
};

setTimeout(() => {
  // = total;

  console.log("Sending mail with total: " + total);
  var options = {
    uri: "http://10.4.200.20:5005/api/v1/send-mail",
    method: "POST",
    json: {
      // send_to: "hau.nguyentat@mobifone.vn",
      send_to: "jonathanrocrach2@gmail.com",
      cc: "jonathanrocrach2@gmail.com",
      subject: "[Cảnh báo hệ thống]",
      content: "Total crawled phone numbers: " + total,
    },
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
    if (error) console.log("error:" + error);
  });

  console.log("total: " + total);
}, 10000);

folders.forEach((fileName, folderIndex) => {
  _getAllFilesFromFolder(fileName, folderIndex);
});
