// ==UserScript==
// @name         Discord - Highlight STscript
// @namespace    https://github.com/LenAnderson
// @downloadURL  https://github.com/LenAnderson/Discord-HighlightSTscript/raw/main/Discord-HighlightSTscript.user.js
// @version      1.2.1
// @description  try to take over the world!
// @author       LenAnderson
// @match        https://discord.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

	const debounce = (func, delay)=>{
		let to;
		return (...args) => {
			if (to) clearTimeout(to);
			to = setTimeout(()=>func.apply(this, args), delay);
		};
	}

    console.log('[STSCRIPT]', hljs);
	GM_addStyle(`
	:root {
    --ac-style-color-border: rgba(69 69 69 / 1);
    --ac-style-color-background: rgba(32 32 32 / 1);
    --ac-style-color-text: rgba(204 204 204 / 1);
    --ac-style-color-matchedBackground: rgba(0 0 0 / 0);
    --ac-style-color-matchedText: rgba(108 171 251 / 1);
    --ac-style-color-selectedBackground: rgba(32 57 92 / 1);
    --ac-style-color-selectedText: rgba(255 255 255 / 1);
    --ac-style-color-notSelectableBackground: rgb(65, 78, 95);
    --ac-style-color-notSelectableText: rgba(255 255 255 / 1);
    --ac-style-color-hoveredBackground: rgba(43 45 46 / 1);
    --ac-style-color-hoveredText: rgba(204 204 204 / 1);
    --ac-style-color-argName: rgba(171 209 239 / 1);
    --ac-style-color-type: rgba(131 199 177 / 1);
    --ac-style-color-cmd: rgba(219 219 173 / 1);
    --ac-style-color-symbol: rgba(115 156 211 / 1);
    --ac-style-color-string: rgba(190 146 122 / 1);
    --ac-style-color-number: rgba(188 205 170 / 1);
    --ac-style-color-variable: rgba(131 193 252 / 1);
    --ac-style-color-variableLanguage: rgba(98 160 251 / 1);
    --ac-style-color-punctuation: rgba(242 214 48 / 1);
    --ac-style-color-punctuationL1: rgba(195 118 210 / 1);
    --ac-style-color-punctuationL2: rgba(98 160 251 / 1);
    --ac-style-color-currentParenthesis: rgba(195 118 210 / 1);
    --ac-style-color-comment: rgba(122 151 90 / 1);
    --ac-style-color-keyword: rgba(182 137 190 / 1);
	}
	.hljs.language-stscript {
    * { text-shadow: none !important; }
    text-shadow: none !important;

    background-color: var(--ac-style-color-background);
    color: var(--ac-style-color-text);

    .hljs-title.function_ {
        color: var(--ac-style-color-cmd);
    }

    .hljs-title.function_.invoke__ {
        color: var(--ac-style-color-cmd);
    }

    .hljs-string {
        color: var(--ac-style-color-string);
    }

    .hljs-number {
        color: var(--ac-style-color-number);
    }

    .hljs-variable {
        color: var(--ac-style-color-variable);
    }

    .hljs-variable.language_ {
        color: var(--ac-style-color-variableLanguage);
    }

    .hljs-property {
        color: var(--ac-style-color-argName);
    }

    .hljs-punctuation {
        color: var(--ac-style-color-punctuation);
    }

    .hljs-comment {
        color: var(--ac-style-color-comment);
    }

    .hljs-abort {
        color: var(--ac-style-color-abort, #e38e23);
        font-weight: bold;
    }

    .hljs-keyword {
        color: var(--ac-style-color-keyword);
        font-weight: bold;
    }

    .hljs-pipe {
        color: var(--ac-style-color-punctuation);
    }
    .hljs-pipebreak {
        color: var(--ac-style-color-type);
    }

    .hljs-closure {
        >.hljs-punctuation {
            color: var(--ac-style-color-punctuation);
        }

        .hljs-closure {
            >.hljs-punctuation {
                color: var(--ac-style-color-punctuationL1);
            }

            .hljs-closure {
                >.hljs-punctuation {
                    color: var(--ac-style-color-punctuationL2);
                }

                .hljs-closure {
                    >.hljs-punctuation {
                        color: var(--ac-style-color-punctuation);
                    }

                    .hljs-closure {
                        >.hljs-punctuation {
                            color: var(--ac-style-color-punctuationL1);
                        }

                        .hljs-closure {
                            >.hljs-punctuation {
                                color: var(--ac-style-color-punctuationL2);
                            }
                        }
                    }
                }
            }
        }
    }
}
	`);
	const registerLanguage = ()=>{
        // NUMBER mode is copied from highlightjs's own implementation for JavaScript
        // https://tc39.es/ecma262/#sec-literals-numeric-literals
        const decimalDigits = '[0-9](_?[0-9])*';
        const frac = `\\.(${decimalDigits})`;
        // DecimalIntegerLiteral, including Annex B NonOctalDecimalIntegerLiteral
        // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
        const decimalInteger = '0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*';
        const NUMBER = {
            className: 'number',
            variants: [
                // DecimalLiteral
                { begin: `(\\b(${decimalInteger})((${frac})|\\.)?|(${frac}))` +
				 `[eE][+-]?(${decimalDigits})\\b` },
                { begin: `\\b(${decimalInteger})\\b((${frac})\\b|\\.)?|(${frac})\\b` },

                // DecimalBigIntegerLiteral
                { begin: '\\b(0|[1-9](_?[0-9])*)n\\b' },

                // NonDecimalIntegerLiteral
                { begin: '\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b' },
                { begin: '\\b0[bB][0-1](_?[0-1])*n?\\b' },
                { begin: '\\b0[oO][0-7](_?[0-7])*n?\\b' },

                // LegacyOctalIntegerLiteral (does not include underscore separators)
                // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
                { begin: '\\b0[0-7]+n?\\b' },
            ],
            relevance: 0,
        };

        function getQuotedRunRegex() {
            try {
                return new RegExp('(".+?(?<!\\\\)")|(\\S+?)(\\||$|\\s)');
            } catch {
                // fallback for browsers that don't support lookbehind
                return /(".+?")|(\S+?)(\||$|\s)/;
            }
        }

        const BLOCK_COMMENT = {
            scope: 'comment',
            begin: /\/\*/,
            end: /\*\|/,
            contains: [],
        };
        const COMMENT = {
            scope: 'comment',
            begin: /\/[/#]/,
            end: /\||$|:}/,
            contains: [],
        };
        const ABORT = {
            begin: /\/(abort|breakpoint)/,
            beginScope: 'abort',
            end: /\||$|(?=:})/,
            excludeEnd: false,
            returnEnd: true,
            contains: [],
        };
        const IMPORT = {
            scope: 'command',
            begin: /\/(import)/,
            beginScope: 'keyword',
            end: /\||$|(?=:})/,
            excludeEnd: false,
            returnEnd: true,
            contains: [],
        };
        const BREAK = {
            scope: 'command',
            begin: /\/(break)/,
            beginScope: 'keyword',
            end: /\||$|(?=:})/,
            excludeEnd: false,
            returnEnd: true,
            contains: [],
        };
        const LET = {
            begin: [
                /\/(let|var)\s+/,
            ],
            beginScope: {
                1: 'variable',
            },
            end: /\||$|:}/,
            excludeEnd: false,
            returnEnd: true,
            contains: [],
        };
        const SETVAR = {
            begin: /\/(setvar|setglobalvar)\s+/,
            beginScope: 'variable',
            end: /\||$|:}/,
            excludeEnd: false,
            returnEnd: true,
            contains: [],
        };
        const GETVAR = {
            begin: /\/(getvar|getglobalvar)\s+/,
            beginScope: 'variable',
            end: /\||$|:}/,
            excludeEnd: false,
            returnEnd: true,
            contains: [],
        };
        const RUN = {
            match: [
                /\/:/,
                getQuotedRunRegex(),
                /\||$|(?=:})/,
            ],
            className: {
                1: 'variable.language',
                2: 'title.function.invoke',
            },
            contains: [], // defined later
        };
        const COMMAND = {
            scope: 'command',
            begin: /\/\S+/,
            beginScope: 'title.function',
            end: /\||$|(?=:})/,
            excludeEnd: false,
            returnEnd: true,
            contains: [], // defined later
        };
        const CLOSURE = {
            scope: 'closure',
            begin: /{:/,
            end: /:}(\(\))?/,
            beginScope: 'punctuation',
            endScope: 'punctuation',
            contains: [], // defined later
        };
        const NAMED_ARG = {
            scope: 'property',
            begin: /\w+=/,
            end: '',
        };
        const MACRO = {
            scope: 'variable',
            begin: /{{/,
            end: /}}/,
        };
        const PIPEBREAK = {
            beginScope: 'pipebreak',
            begin: /\|\|/,
            end: '',
        };
        const PIPE = {
            beginScope: 'pipe',
            begin: /\|/,
            end: '',
        };
        BLOCK_COMMENT.contains.push(
            BLOCK_COMMENT,
        );
        RUN.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            hljs.QUOTE_STRING_MODE,
            NUMBER,
            MACRO,
            CLOSURE,
        );
        IMPORT.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            NUMBER,
            MACRO,
            CLOSURE,
            hljs.QUOTE_STRING_MODE,
        );
        BREAK.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            NUMBER,
            MACRO,
            CLOSURE,
            hljs.QUOTE_STRING_MODE,
        );
        LET.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            NUMBER,
            MACRO,
            CLOSURE,
            hljs.QUOTE_STRING_MODE,
        );
        SETVAR.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            NUMBER,
            MACRO,
            CLOSURE,
            hljs.QUOTE_STRING_MODE,
        );
        GETVAR.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            hljs.QUOTE_STRING_MODE,
            NUMBER,
            MACRO,
            CLOSURE,
        );
        ABORT.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            NUMBER,
            MACRO,
            CLOSURE,
            hljs.QUOTE_STRING_MODE,
        );
        COMMAND.contains.push(
            hljs.BACKSLASH_ESCAPE,
            NAMED_ARG,
            NUMBER,
            MACRO,
            CLOSURE,
            hljs.QUOTE_STRING_MODE,
        );
        CLOSURE.contains.push(
            hljs.BACKSLASH_ESCAPE,
            BLOCK_COMMENT,
            COMMENT,
            ABORT,
            IMPORT,
            BREAK,
            NAMED_ARG,
            NUMBER,
            MACRO,
            RUN,
            LET,
            GETVAR,
            SETVAR,
            COMMAND,
            'self',
            hljs.QUOTE_STRING_MODE,
            PIPEBREAK,
            PIPE,
        );
        hljs.registerLanguage('stscript', ()=>({
            case_insensitive: false,
            keywords: [],
            contains: [
                hljs.BACKSLASH_ESCAPE,
                BLOCK_COMMENT,
                COMMENT,
                ABORT,
                IMPORT,
                BREAK,
                RUN,
                LET,
                GETVAR,
                SETVAR,
                COMMAND,
                CLOSURE,
                PIPEBREAK,
                PIPE,
            ],
        }));
    };

	registerLanguage();

	const highlight = ()=>{
		for (const block of [...document.querySelectorAll('code.hljs:not(span)')]) {
			console.log('[STSCRIPT]', block);
			if (block.textContent[0] != '/') continue;
			block.classList.add('language-stscript');
			block.classList.add('stscript');
			block.innerHTML = hljs.highlight(block.textContent, { language:'stscript', ignoreIllegals:true })?.value ?? block.innerHTML;
		}
	};
	const highlightDebounced = debounce(highlight, 1000);
	highlightDebounced();
	const mo = new MutationObserver(muts=>highlightDebounced());
	mo.observe(document.body, { subtree:true, childList:true });
	unsafeWindow.hljs = hljs;
})();
