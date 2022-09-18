import { getCurrentInstance } from 'vue';

const useAppInstance = () => {
  const { appContext } = getCurrentInstance();
  return appContext.config.globalProperties;
};

export default useAppInstance;
