/**
 * @fileoverview Parser for the Markdown question format used by
 * `src/questions/<LEVEL>/<TOPIC>/*.md`.
 *
 * Each file is a tiny YAML frontmatter block plus a free-form
 * Markdown body that becomes the question prompt. Frontmatter is
 * parsed with a hand-written mini-YAML so we avoid pulling in
 * `gray-matter` / `js-yaml` (keeps the bundle small).
 *
 * Supported question types (the `type:` field):
 *
 *   select-one    — radio buttons, one correct answer.
 *   multi-select  — checkboxes, one OR more correct answers.
 *   dropbox       — drag & drop word ordering (`words:` list).
 *   input-text    — free-text fill-in-the-blank (`correct:` list).
 *   text-gaps     — long text, clickable gaps with 3-option popups.
 *
 * Example minimal file:
 *
 *   ---
 *   id: 001-das-buch
 *   type: select-one
 *   options:
 *     - Der
 *     - Die
 *     - Das
 *   correct: Das
 *   ---
 *
 *   ___ Buch ist neu.
 *
 * The body is treated as plain text; leading / trailing whitespace
 * (and the leading code-fence-free Markdown structure) is trimmed.
 */

const FRONTMATTER_RE = /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/;

/**
 * Strips inline YAML comments (`# comment`) and trims whitespace from
 * the right side of a value. Returns `undefined` for empty results.
 *
 * @param {string} value
 * @return {string}
 */
function cleanValue(value) {
  if (value === undefined || value === null) return '';
  const idx = value.indexOf(' #');
  const noComment = idx === -1 ? value : value.slice(0, idx);
  return noComment.replace(/\s+$/, '');
}

/**
 * Strips one matching pair of surrounding quotes from a string.
 *
 * @param {string} value
 * @return {string}
 */
function unquote(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

/**
 * Coerces a raw frontmatter scalar into the closest JS primitive
 * (boolean, number, string). Lists are handled separately.
 *
 * @param {string} raw  Value with surrounding whitespace removed.
 * @return {*}
 */
function coerceScalar(raw) {
  const value = unquote(cleanValue(raw));
  if (value === '') return '';
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '~') return null;
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d+\.\d+$/.test(value)) return parseFloat(value);
  return value;
}

/**
 * Parses a YAML-lite frontmatter block. Supports:
 *   key: value
 *   key:
 *     - item
 *     - item
 *
 * Nested objects, anchors, flow style, and folded scalars are NOT
 * supported — by design, to keep the parser ~30 lines.
 *
 * @param {string} block  Raw YAML body (without the `---` fences).
 * @return {!Object}
 * @throws {Error} on a syntactically obvious mistake (catches typos).
 */
function parseFrontmatter(block) {
  const result = {};
  const lines = block.split(/\r?\n/);
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) {
      i += 1;
      continue;
    }

    const match = line.match(/^([A-Za-z_][\w-]*)\s*:(.*)$/);
    if (!match) {
      throw new Error(`Frontmatter parse error on line: ${JSON.stringify(line)}`);
    }
    const key = match[1];
    const inline = match[2];

    if (cleanValue(inline) !== '') {
      result[key] = coerceScalar(inline.trim());
      i += 1;
      continue;
    }

    const list = [];
    i += 1;
    while (i < lines.length) {
      const next = lines[i];
      const item = next.match(/^\s+-\s+(.*)$/);
      if (!item) break;
      list.push(coerceScalar(item[1]));
      i += 1;
    }
    result[key] = list;
  }

  return result;
}

/**
 * Parses a single Markdown question file into the canonical
 * in-memory question object consumed by `<QuestionRenderer>`.
 *
 * @param {string} raw    Full file contents (frontmatter + body).
 * @param {{level:string, topic:string, path?:string}} context
 *     Derived metadata — usually the level + topic come from the
 *     file path (see `src/data/questions.js`).
 * @return {!Object} Validated question object.
 * @throws {Error} when the file is malformed.
 */
export function parseQuestionFile(raw, context) {
  const match = (raw || '').match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(
      `Missing YAML frontmatter in ${context?.path || 'question file'}`,
    );
  }

  const meta = parseFrontmatter(match[1]);
  const body = (match[2] || '').trim();

  if (!meta.id) throw new Error(`Question is missing "id" (${context?.path})`);
  if (!meta.type) throw new Error(`Question is missing "type" (${context?.path})`);

  const question = {
    id: String(meta.id),
    type: String(meta.type),
    level: String(context.level || meta.level || '').toUpperCase(),
    topic: String(context.topic || meta.topic || '').toUpperCase(),
    prompt: body,
    hint: meta.hint || '',
  };

  switch (question.type) {
    case 'select-one': {
      if (!Array.isArray(meta.options) || meta.options.length < 2) {
        throw new Error(`select-one needs at least 2 options (${context?.path})`);
      }
      if (typeof meta.correct !== 'string') {
        throw new Error(`select-one needs a string "correct" (${context?.path})`);
      }
      if (!meta.options.includes(meta.correct)) {
        throw new Error(
          `select-one "correct" must appear in options (${context?.path})`,
        );
      }
      question.options = meta.options.map(String);
      question.correct = String(meta.correct);
      break;
    }
    case 'multi-select': {
      if (!Array.isArray(meta.options) || meta.options.length < 2) {
        throw new Error(`multi-select needs at least 2 options (${context?.path})`);
      }
      const correctList = Array.isArray(meta.correct)
        ? meta.correct.map(String)
        : [String(meta.correct)];
      if (!correctList.length) {
        throw new Error(`multi-select needs at least one correct option (${context?.path})`);
      }
      for (const c of correctList) {
        if (!meta.options.includes(c)) {
          throw new Error(
            `multi-select "correct" "${c}" not present in options (${context?.path})`,
          );
        }
      }
      question.options = meta.options.map(String);
      question.correct = correctList;
      break;
    }
    case 'dropbox': {
      if (!Array.isArray(meta.words) || meta.words.length < 2) {
        throw new Error(`dropbox needs a "words" list with 2+ items (${context?.path})`);
      }
      question.words = meta.words.map(String);
      if (Array.isArray(meta.codes)) question.codes = meta.codes.map(String);
      if (Array.isArray(meta.alternatives)) {
        const primaryKey = [...question.words].sort().join('|');
        question.alternatives = meta.alternatives.map((alt, i) => {
          const words = String(alt)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
          if (words.length !== question.words.length) {
            throw new Error(
              `dropbox alternative ${i + 1} must have ${question.words.length} words (${context?.path})`,
            );
          }
          if ([...words].sort().join('|') !== primaryKey) {
            throw new Error(
              `dropbox alternative ${i + 1} must use the same words as "words" (${context?.path})`,
            );
          }
          return words;
        });
      }
      break;
    }
    case 'input-text': {
      const correctList = Array.isArray(meta.correct)
        ? meta.correct.map(String)
        : meta.correct !== undefined
          ? [String(meta.correct)]
          : [];
      if (!correctList.length) {
        throw new Error(`input-text needs at least one "correct" value (${context?.path})`);
      }
      question.correct = correctList;
      break;
    }
    case 'text-gaps': {
      const correctList = Array.isArray(meta.correct)
        ? meta.correct.map(String)
        : [];
      const optionsRows = Array.isArray(meta.options)
        ? meta.options.map((row) => String(row).split(',').map((s) => s.trim()).filter(Boolean))
        : [];
      if (!correctList.length) {
        throw new Error(`text-gaps needs a "correct" list (${context?.path})`);
      }
      if (correctList.length !== optionsRows.length) {
        throw new Error(
          `text-gaps "correct" and "options" must have same length (${context?.path})`,
        );
      }
      const gapCount = (body.match(/___/g) || []).length;
      if (gapCount !== correctList.length) {
        throw new Error(
          `text-gaps: ${gapCount} "___" in body but ${correctList.length} gap(s) (${context?.path})`,
        );
      }
      question.gaps = correctList.map((correct, i) => {
        const opts = optionsRows[i];
        if (opts.length !== 3) {
          throw new Error(
            `text-gaps gap ${i + 1} needs exactly 3 options (${context?.path})`,
          );
        }
        if (!opts.includes(correct)) {
          throw new Error(
            `text-gaps gap ${i + 1}: correct "${correct}" not in options (${context?.path})`,
          );
        }
        return { correct, options: opts };
      });
      break;
    }
    default:
      throw new Error(
        `Unknown question type "${question.type}" (${context?.path})`,
      );
  }

  return question;
}
