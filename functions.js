export const getTwoLettersFromName = (name) => {
  let list = name.split(" ");
  if (list.length > 1) {
    let firstCharacter = list[0][0];
    let secondCharacter = list[1][0];
    return firstCharacter + secondCharacter;
  } else if (name.length == 1) {
    return name[0];
  } else if (name.length == 0) {
    return "TT";
  } else {
    let firstCharacter = name[0];
    let secondCharacter = name[1];
    return firstCharacter + secondCharacter;
  }
};
