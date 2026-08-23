const DEFAULT_TYPES = ['text/html', 'text/markdown'];

export function parseAccept(header) {
  return String(header || '')
    .split(',')
    .map((part, position) => {
      const [mediaRange, ...parameters] = part
        .trim()
        .toLowerCase()
        .split(';');
      const [type, subtype] = mediaRange.split('/');
      if (!type || !subtype) {
        return null;
      }

      const qParameter = parameters.find((parameter) =>
        parameter.trim().startsWith('q=')
      );
      const parsedQ = qParameter ? Number(qParameter.trim().slice(2)) : 1;
      const q =
        Number.isFinite(parsedQ) && parsedQ >= 0 && parsedQ <= 1
          ? parsedQ
          : 0;

      return { type, subtype, q, position };
    })
    .filter(Boolean);
}

function matchSpecificity(entry, candidate) {
  const [type, subtype] = candidate.split('/');
  if (entry.type === type && entry.subtype === subtype) {
    return 2;
  }
  if (entry.type === type && entry.subtype === '*') {
    return 1;
  }
  if (entry.type === '*' && entry.subtype === '*') {
    return 0;
  }
  return -1;
}

export function preferredType(header, produces = DEFAULT_TYPES) {
  if (!header) {
    return produces[0];
  }

  const entries = parseAccept(header);
  if (entries.length === 0) {
    return null;
  }

  const candidates = produces
    .map((candidate, candidatePosition) => {
      const matches = entries
        .map((entry) => ({
          ...entry,
          specificity: matchSpecificity(entry, candidate),
        }))
        .filter((entry) => entry.specificity >= 0)
        .sort(
          (first, second) =>
            second.specificity - first.specificity ||
            first.position - second.position
        );
      const match = matches[0];

      return match
        ? {
            candidate,
            candidatePosition,
            q: match.q,
            position: match.position,
          }
        : null;
    })
    .filter(Boolean)
    .filter((candidate) => candidate.q > 0);

  candidates.sort(
    (first, second) =>
      second.q - first.q ||
      first.position - second.position ||
      first.candidatePosition - second.candidatePosition
  );

  return candidates[0]?.candidate || null;
}

export function appendVary(headers, token) {
  const existing = headers.get('Vary');
  if (!existing) {
    headers.set('Vary', token);
    return;
  }

  const tokens = existing.split(',').map((value) => value.trim());
  if (!tokens.some((value) => value.toLowerCase() === token.toLowerCase())) {
    headers.set('Vary', `${existing}, ${token}`);
  }
}
