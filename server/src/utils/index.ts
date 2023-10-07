/** @dev @todo this may not account for daylight savings.. to fix check https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset */
export const findTimestamp = () => new Date().toISOString().slice(0, 19).replace('T', ' ')
