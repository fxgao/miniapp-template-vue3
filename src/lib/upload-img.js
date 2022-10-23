import dataApi from '@/api';
import crypto from 'crypto-js';
import { Base64 } from 'js-base64';
import Constant from '@/lib/constant';

const OSS_HOST = 'https://htennis1.oss-cn-beijing.aliyuncs.com';

const getExpiration = () => {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  return date.toISOString();
};

const computePolicy = (expiration, maxSize) => {
  return Base64.encode(
    JSON.stringify({
      expiration, // policy过期时间
      conditions: [
        // 限制上传大小。
        ['content-length-range', 0, maxSize || 1024 * 1024 * 1024]
      ]
    })
  );
};

const computeSignature = (accessKeySecret, canonicalString) => {
  return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
};

/*
  @params: files => [{path:'xxx',key:'...'}]
  @return: [{imageUrl: '...', ....}]
*/
export default function (_files) {
  if (!_files) return Promise.resolve({ status: 'fail' });
  const expiration = getExpiration();
  const policy = computePolicy(expiration);
  const files = Array.isArray(_files) ? [..._files] : [{ ..._files }];

  return dataApi.common
    .getUploadSTSToken()
    .then((r) => {
      const { accessKeyId, accessKeySecret, expiration, securityToken } = r;
      return {
        OSSAccessKeyId: accessKeyId,
        policy,
        Signature: computeSignature(accessKeySecret, policy),
        'x-oss-security-token': securityToken,
        dir: `user-avatar_${Constant.PROCESS_ENV}/`
      };
    })
    .then((params) => {
      return Promise.all([
        ...files.map((i, idx) => {
          const fileKey = params.dir + i.key;
          return new Promise((resolve, reject) => {
            uni.uploadFile({
              url: OSS_HOST,
              filePath: i.path,
              name: 'file',
              formData: {
                ...params,
                key: fileKey
              },
              success: (result) => {
                const { statusCode } = result;
                if (statusCode === 204) {
                  resolve({ ...i, imgUrl: OSS_HOST + '/' + fileKey });
                } else {
                  reject({ status: 'fail', err: result });
                }
              },
              fail: (e) => reject({ status: 'fail', err: e })
            });
          });
        })
      ]);
    })
    .then((r) => ({ status: 'success', files: r }));
}
