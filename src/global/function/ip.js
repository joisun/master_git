import ip from 'ip'
import cidrOverlap from 'cidr-overlap'

const word = '[a-fA-F\\d:]'

const boundry = (options) =>
  options && options.includeBoundaries ? `(?:(?<=\\s|^)(?=${word})|(?<=${word})(?=\\s|$))` : ''

const v4 =
  '(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}'

const v6segment = '[a-fA-F\\d]{1,4}'

const v6 = `
(?:
(?:${v6segment}:){7}(?:${v6segment}|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8
(?:${v6segment}:){6}(?:${v4}|:${v6segment}|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4
(?:${v6segment}:){5}(?::${v4}|(?::${v6segment}){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4
(?:${v6segment}:){4}(?:(?::${v6segment}){0,1}:${v4}|(?::${v6segment}){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4
(?:${v6segment}:){3}(?:(?::${v6segment}){0,2}:${v4}|(?::${v6segment}){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4
(?:${v6segment}:){2}(?:(?::${v6segment}){0,3}:${v4}|(?::${v6segment}){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4
(?:${v6segment}:){1}(?:(?::${v6segment}){0,4}:${v4}|(?::${v6segment}){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4
(?::(?:(?::${v6segment}){0,5}:${v4}|(?::${v6segment}){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4
)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1
`
  .replace(/\s*\/\/.*$/gm, '')
  .replace(/\n/g, '')
  .trim()

// Pre-compile only the exact regexes because adding a global flag make regexes stateful
const v46Exact = new RegExp(`(?:^${v4}$)|(?:^${v6}$)`)
const v4exact = new RegExp(`^${v4}$`)
const v6exact = new RegExp(`^${v6}$`)

const ipRegex = (options) =>
  options && options.exact
    ? v46Exact
    : new RegExp(
        `(?:${boundry(options)}${v4}${boundry(options)})|(?:${boundry(options)}${v6}${boundry(
          options
        )})`,
        'g'
      )

ipRegex.v4 = (options) =>
  options && options.exact
    ? v4exact
    : new RegExp(`${boundry(options)}${v4}${boundry(options)}`, 'g')
ipRegex.v6 = (options) =>
  options && options.exact
    ? v6exact
    : new RegExp(`${boundry(options)}${v6}${boundry(options)}`, 'g')

//CIDR
const defaultOpts = { exact: false }
const v4cidrstr = `${ipRegex.v4().source}\\/(3[0-2]|[12]?[0-9])`
const v6cidrstr = `${ipRegex.v6().source}\\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])`

// can not precompile the non-exact regexes because global flag makes the regex object stateful
// which would require the user to reset .lastIndex on subsequent calls
const v4cidrexact = new RegExp(`^${v4cidrstr}$`)
const v6cidrexact = new RegExp(`^${v6cidrstr}$`)
const v46cidrexact = new RegExp(`(?:^${v4cidrstr}$)|(?:^${v6cidrstr}$)`)

const cidr = ({ exact } = defaultOpts) =>
  exact ? v46cidrexact : new RegExp(`(?:${v4cidrexact})|(?:${v6cidrexact})`, 'g')

cidr.v4 = ({ exact } = defaultOpts) => (exact ? v4cidrexact : new RegExp(v4cidrstr, 'g'))
cidr.v6 = ({ exact } = defaultOpts) => (exact ? v6cidrexact : new RegExp(v6cidrstr, 'g'))

ipRegex.cidr = cidr

ip.ipRegex = ipRegex
ip.cidrOverlap = cidrOverlap

export default ip
