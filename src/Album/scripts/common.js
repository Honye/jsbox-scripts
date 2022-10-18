const albumsPath = 'albums/';

/**
 * 读取指定相册中图片列表
 * @param {string} albumName 相册名
 */
const readPhotos = (albumName) => {
  const albumPath = `${albumsPath}${albumName}/`
  return $file
    .list(albumPath)
    .map((filename) => `${albumPath}${filename}`)
}

/**
 * 读取相册列表
 * @returns {AlbumItem[]}
 */
const readAlbums = () => {
  return $file
    .list(albumsPath)
    .map((albumName) => ({
      name: albumName,
      photos: readPhotos(albumName)
    }))
}

const mapAlbumsData = (albums) => {
  return albums.map((item) => ({
    image: { src: item.photos && item.photos[0] || '' },
    name: { text: item.name },
    count: { text: `${item.photos.length}` },
  }))
}

module.exports = {
  albumsPath,
  readPhotos,
  readAlbums,
  mapAlbumsData
}


// ====== types ======
/**
 * @typedef {object} AlbumItem 相册单元项
 * @property {string} name 相册名
 * @property {string[]} photos 相册包含的图片路径列表
 */