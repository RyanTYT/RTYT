export const aboutMeStr = `
        <style>
            @keyframes highlight {
                0% { 
                    background-position: right;
                }
                100% { 
                    background-position: left;
                }
            }

            .highlighted {
                display: inline;
                background: linear-gradient(to right, var(--important-translucent), var(--important) 50%, transparent 50%); /* Gradient from yellow to transparent */
                background-size: 200% 50%; /* Double the width of the background for animation */
                background-position: 100% 50%; /* Start at the right */
                animation: highlight 2s ease-in-out forwards; /* Infinite animation loop */
                color: var(--flip-font-color);
                padding: 0rem 0.3rem;
                border-radius: 0.2rem;
            }

            <style>
    @keyframes highlight {
        0% { 
            background-position: 100% 0; /* Start at the right */
        }
        100% { 
            background-position: 0 0; /* End at the left */
        }
    }

</style>

        </style>
				Hi! I'm currently a <span class="impt highlighted">Year 3 undergraduate</span> studying a Double Degree Programme 
                in Business Analytics (BZA) and Business Administration (BBA) in NUS
				(National University of Singapore). For clarity, I'm under the School of 
                Computing as well as the School of Business. After exploring this space, I 
                realised I most enjoy solving <span class="impt highlighted">complex problems - coding or logic problems</span>
                (which also plays into why I decided to TA CS2040 - Data Structures and 
                Algorithms). As such, certain applications of Machine Learning and AI, which
                seem like amazing answers to probability questions, also greatly interest me.
				Feel free to reach out to me via any of the links at the bottom!"
`;
