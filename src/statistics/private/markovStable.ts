function gaussj(a: number[][], n: number, f: number[]) {
  const m = n + 1

  // implicit pivoting
  for (let i = 0; i < m; i++) {
    let amx = Math.abs(a[i][0])

    for (let j = 1; j < n; j++) {
      if (amx < Math.abs(a[i][j])) amx = Math.abs(a[i][j])
    }

    for (let j = 0; j < m; j++) a[i][j] /= amx
  }

  for (let i = 0; i < n; i++) {
    // select pivot
    if (i > 0) {
      let r = i

      for (let k = i + 1; k < m; k++) {
        if (Math.abs(a[r][i]) < Math.abs(a[k][i])) r = k
      }

      for (let j = 0; j < m; j++) {
        const t = a[i][j]

        a[i][j] = a[r][j]

        a[r][j] = t
      }
    }

    // normalize line i
    let d = a[i][i]
    for (let j = i; j < m; j++) {
      a[i][j] /= d
    }

    // subtract line i from k!=i.
    for (let k = 0; k < m; k++) {
      if (k !== i) {
        d = a[k][i]

        for (let j = i; j < m; j++) {
          a[k][j] -= d * a[i][j]
        }
      }
    }
  }

  for (let i = 0; i < n; i++) {
    f[i] = a[i][m - 1]
  }
}

/**
 *
 * @author FUKUDA Hiroshi, 2004.10.12
 */
export function markovStable(p: number[][]): number[] {
  const n = p.length

  // add normalization condition
  const m = n + 1

  const a = new Array(m)

  for (let i = 0; i < m; i++) {
    a[i] = new Array(m)

    for (let j = 0; j < m; j++) a[i][j] = 0
  }

  for (let j = 0; j < m; j++) a[0][j] = 1

  // copy transverse of p-1 to a
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) a[i + 1][j] = p[j][i]
      else a[i + 1][j] = p[j][i] - 1
    }
  }

  const f = new Array(n)

  gaussj(a, n, f)

  return f
}
