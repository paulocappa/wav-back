export default interface IStorageProvider {
  saveFile(path: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
}
