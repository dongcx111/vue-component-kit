export const pkgExists = (pkgName: string) => {
  try {
    import.meta.resolve(pkgName);
    return true;
  } catch {
    return false;
  }
};
