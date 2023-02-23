export class FileProcess {
	private static getfileType(mime: string) {
		switch (mime.split('/')[1]) {
			case 'jpeg':
			case 'jpg':
				return 'jpg';

			default:
				return 'png';
		}
	}

	static dataURLtoFormData(filename: string, dataUrl: string) {
		const blob = FileProcess.dataUrltoBlob(dataUrl);
		const fd = new FormData();
		fd.append('file', blob, `${filename}.${FileProcess.getfileType(blob.type)}`);
		return fd;
	}

	static dataUrltoBlob(dataUrl: string) {
		var arr = dataUrl.split(',');
		var mime = ((arr[0] as string).match(/:(.*?);/) as string[])[1];
		var bstr = atob(arr[1]);
		var n = bstr.length;
		var u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}

		return new Blob([u8arr], { type: mime });
	}
}
