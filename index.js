var filesystem = require("fs");

var request = require("request");

var folders = [
  "../data/dothi.net",
  "../data/muaban.net",
  "../data/nhattao.com",
];

var total = 0;

var _getAllFilesFromFolder = function (dir, folderIndex) {
  var results = [];

  filesystem.readdirSync(dir).forEach(function (file, index, arr) {
    file = dir + "/" + file;
    var stat = filesystem.statSync(file);
    var regex = new RegExp("json$");

    if (!file.match(regex)) return;

    var count = 0;

    var i;
    filesystem
      .createReadStream(file)
      .on("data", function (chunk) {
        for (i = 0; i < chunk.length; ++i) if (chunk[i] == 10) count++;
      })
      .on("end", function () {
        total += count;
        console.log(file + " : " + count);
        // send mail here
        if (index == arr.length - 1 && folderIndex == folders.length - 1) {
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
        }
      });

    if (stat && stat.isDirectory()) {
      results = results.concat(_getAllFilesFromFolder(file));
    } else results.push(file);
  });

  return results;
};

folders.forEach((fileName, folderIndex) => {
  _getAllFilesFromFolder(fileName, folderIndex);
});
