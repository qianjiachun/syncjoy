import { NodeSSH } from "node-ssh";
import path, { join } from "path";
import fs from "fs";
import archiver from "archiver";
import chalk from "chalk";
import ProgressBar from "progress";
import { exit } from "process";

const config = JSON.parse(fs.readFileSync(join(path.resolve(), "/deploy/config.json"), "utf-8"));

const ssh = new NodeSSH();

const serversConfigs = config;
// [{
//   "host": "ip",
//   "port": "端口",
//   "username": "账号",
//   "password": "密码",
//   "remotePath": "服务器上的部署目录"
// }]

const distFolderPath = "./dist";
const archiveName = "dist.zip";
const localArchivePath = path.join(path.resolve(), archiveName);
// 创建进度条
const bar = new ProgressBar("部署进度 [:bar] :percent", {
  complete: "=",
  incomplete: " ",
  width: 40,
  total: serversConfigs.length * 3
});

async function deploy() {
  try {
    console.log(chalk.blue("开始部署..."));

    // 打包dist目录
    await packDirectory(distFolderPath, localArchivePath);

    // 对每个服务器配置进行循环处理
    for (const config of serversConfigs) {
      await deployToServer(config);
    }
  } catch (error) {
    console.error(chalk.red(`部署失败：${error}`));
    exit();
  } finally {
    // 删除本地压缩包
    fs.unlinkSync(localArchivePath);
  }

  console.log(chalk.green("部署完成"));
  for (const config of serversConfigs) {
    console.log(chalk.green(`链接: ${config.url}`));
  }
  exit();
}

async function deployToServer(config) {
  await ssh.connect(config);
  bar.tick();
  await ssh.putFile(localArchivePath, `${config.remotePath}/${archiveName}`);
  bar.tick();
  await ssh.execCommand(`unzip -o ${archiveName} -d ${config.remotePath} && rm ${archiveName}`, { cwd: config.remotePath });
  bar.tick();
}

function packDirectory(sourceDir, outPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(sourceDir, false);
    archive.finalize();
  });
}

deploy();
