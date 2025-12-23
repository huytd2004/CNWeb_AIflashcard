export const difficultyLevels = [
    { value: 'a1', label: 'A1 - Beginner' },
    { value: 'a2', label: 'A2 - Elementary' },
    { value: 'b1', label: 'B1 - Intermediate' },
    { value: 'b2', label: 'B2 - Upper Intermediate' },
    { value: 'c1', label: 'C1 - Advanced' },
    { value: 'c2', label: 'C2 - Proficiency' },
]

export const questionCounts = [
    { value: '10', label: '10 Câu hỏi' },
    { value: '20', label: '20 Câu hỏi' },
    { value: '30', label: '30 Câu hỏi' },
    { value: '40', label: '50 Câu hỏi' },
    { value: '50', label: '50 Câu hỏi' },
]

export const questionTimeLimits = [
    { value: '30', label: '30 Phút' },
    { value: '45', label: '45 Phút' },
    { value: '60', label: '60 Phút' },
    { value: '90', label: '90 Phút' },
    { value: '120', label: '120 Phút' },
]

export const skillTypes = [
    { value: 'grammar', label: 'Ngữ pháp' },
    { value: 'vocabulary', label: 'Từ vựng' },
    { value: 'reading', label: 'Đọc hiểu' },
    { value: 'listening', label: 'Nghe hiểu' },
    { value: 'writing', label: 'Viết' },
]

export const questionTypes = [
    { value: 'multiple-choice', label: 'Trắc nghiệm' },
    { value: 'fill-blank', label: 'Điền từ' },
    { value: 'matching', label: 'Nối câu' },
    { value: 'reorder', label: 'Sắp xếp câu' },
    { value: 'rewrite', label: 'Viết lại câu' },
    { value: 'true-false', label: 'Đúng/Sai' },
]

export const difficultyOptions = [
    {
        value: 'easy',
        label: 'Cơ bản',
        badge: 'Cơ bản',
        desc: 'Phù hợp cho người mới bắt đầu',
        color: 'border-green-100 text-green-800 dark:border-green-800/40 dark:text-green-200',
        bgColor: 'bg-green-50 dark:bg-green-800/30',
    },
    {
        value: 'medium',
        label: 'Trung bình',
        badge: 'Vừa',
        desc: 'Cần hiểu biết nhất định về chủ đề',
        color: 'border-yellow-100 text-yellow-800 dark:border-yellow-800/40 dark:text-yellow-200',
        bgColor: 'bg-yellow-50 dark:bg-yellow-800/30',
    },
    {
        value: 'hard',
        label: 'Nâng cao',
        badge: 'Khó',
        desc: 'Đòi hỏi kiến thức chuyên sâu',
        color: 'border-red-100 text-red-800 dark:border-red-800/40 dark:text-red-200',
        bgColor: 'bg-red-50 dark:bg-red-800/30',
    },
]

export const topicSuggestions = ['Toán học cơ bản', 'Lịch sử Việt Nam', 'Tiếng Anh giao tiếp', 'Khoa học tự nhiên', 'Công nghệ thông tin', 'Kinh tế học', 'Văn học Việt Nam', 'Địa lý thế giới']

export const topicOptionsTemplate = [
    {
        label: 'Kiểu bình thường',
        description: `
Câu 1. Chi tiêu công thường xuyên không bao gồm khoản nào sau đây?
A. Chi cho xây dựng cầu đường mới
B. Chi lương công chức
C. Chi hoạt động hành chính
D. Chi chuyển giao
Đáp án đúng: A

Câu 2. Đặc điểm cốt lõi của chi tiêu công thường xuyên là gì?
A. Tạo ra giá trị tích lũy lâu dài
B. Có hiệu lực tác động lâu dài
C. Tạo ra năng lực sản xuất mới
D. Mang tính tiêu dùng, ngắn hạn, lặp lại
Đáp án đúng: D

Câu 3. Phương pháp phổ biến trong đánh giá chi thường xuyên là gì?
A. Tối đa hóa lợi nhuận
B. Tối thiểu hóa chi phí theo định mức
C. Tối ưu hóa tài sản công
D. Tối đa hóa đầu tư
Đáp án đúng: B
`,
    },
    {
        label: 'Kiểu đưa ra gợi ý',
        description: `Tạo 20 câu hỏi về đại số tuyến tính, bao gồm các chủ đề như ma trận, định thức, không gian véc tơ, phương trình tuyến tính`,
    },
]
export const contentSuggestions = [
    {
        title: 'Gia đình',
        description: 'Tạo câu hỏi về từ vựng liên quan đến gia đình, bao gồm các thành viên và mối quan hệ.',
    },
    {
        title: 'Giao tiếp nơi công sở',
        description: 'Tạo câu hỏi về các tình huống giao tiếp trong môi trường làm việc, như cuộc họp, email, và điện thoại.',
    },
    {
        title: 'Thời tiết và khí hậu',
        description: 'Tạo câu hỏi về từ vựng và cấu trúc câu liên quan đến thời tiết, khí hậu và các hiện tượng tự nhiên.',
    },
    {
        title: 'Du lịch và địa điểm',
        description: 'Tạo câu hỏi về từ vựng du lịch, địa điểm nổi tiếng và các hoạt động khi đi du lịch.',
    },
    {
        title: 'Sức khỏe và thể dục',
        description: 'Tạo câu hỏi về từ vựng liên quan đến sức khỏe, thể dục và chế độ ăn uống lành mạnh.',
    },
    {
        title: 'Giáo dục và học tập',
        description: 'Tạo câu hỏi về các chủ đề liên quan đến giáo dục, trường học, và các phương pháp học tập.',
    },
    {
        title: 'Công nghệ và Internet',
        description: 'Tạo câu hỏi về từ vựng công nghệ, Internet, và các thiết bị điện tử.',
    },
    {
        title: 'Văn hóa và giải trí',
        description: 'Tạo câu hỏi về các chủ đề văn hóa, nghệ thuật, âm nhạc và giải trí.',
    },
]

export const questionsTemplate = {
    title: 'test-ai-english',
    description: 'Bài kiểm tra tiếng Anh do AI tạo',
    difficulty: 'B2', // A1, A2, B1, B2, C1, C2 hoặc Beginners, Intermediate, Advanced
    skills: ['reading', 'vocabulary', 'grammar'], // Đọc hiểu, Từ vựng, Ngữ pháp, Nghe hiểu
    timeLimit: 45, // Thời gian làm bài ước tính
    questions: [
        {
            question_id: 'q_001',
            question_type: 'multiple_choice', // Trắc nghiệm
            skill_focus: 'vocabulary',
            question_text: "Choose the correct synonym for 'ubiquitous' in the following sentence: 'Smartphones are now ubiquitous devices in our daily lives.'",
            options: [
                { id: 'opt_a', text: 'rare' },
                { id: 'opt_b', text: 'common' },
                { id: 'opt_c', text: 'ancient' },
                { id: 'opt_d', text: 'complex' },
            ],
            correct_answer_id: 'opt_b',
            explanation: "Ubiquitous means 'present, appearing, or found everywhere', so 'common' is the best synonym.",
            score_points: 5,
        },
        {
            question_id: 'q_002',
            question_type: 'fill_in_the_blank', // Điền từ vào chỗ trống
            skill_focus: 'grammar',
            question_text: 'She has been learning English _____ five years.',
            blank_position: [5, 5], // Vị trí để chèn input (word index starting from 0, length) - Tùy chọn, để frontend xử lý tốt hơn
            correct_answer_text: 'for',
            explanation: "We use 'for' to indicate a duration of time.",
            score_points: 5,
        },
        {
            question_id: 'q_003',
            question_type: 'matching', // Nối câu
            skill_focus: 'vocabulary',
            question_text: 'Match the words on the left with their definitions on the right.',
            left_items: [
                { id: 'left_1', text: 'innovation' },
                { id: 'left_2', text: 'sustainable' },
                { id: 'left_3', text: 'diverse' },
            ],
            right_items: [
                { id: 'right_a', text: 'able to be maintained at a certain rate or level' },
                { id: 'right_b', text: 'a new method, idea, product, etc.' },
                { id: 'right_c', text: 'showing a great deal of variety; very different' },
            ],
            correct_matches: [
                { left_id: 'left_1', right_id: 'right_b' },
                { left_id: 'left_2', right_id: 'right_a' },
                { left_id: 'left_3', right_id: 'right_c' },
            ],
            explanation: 'Match the words with their correct definitions.',
            score_points: 10,
        },
        {
            question_id: 'q_004',
            question_type: 'rearrange_sentences', // Sắp xếp lại câu
            skill_focus: 'reading',
            question_text: 'Rearrange the following sentences to form a coherent paragraph.',
            scrambled_sentences: [
                { id: 's_1', text: 'Secondly, it helps to expand your vocabulary.' },
                { id: 's_2', text: 'Finally, reading regularly improves your writing skills.' },
                { id: 's_3', text: 'Reading is essential for several reasons. ' },
                { id: 's_4', text: 'Firstly, it enhances your understanding of different cultures.' },
            ],
            correct_order_ids: ['s_3', 's_4', 's_1', 's_2'],
            explanation: 'The correct order establishes the main point first, then provides supporting reasons.',
            score_points: 10,
        },
        {
            question_id: 'q_005',
            question_type: 'rewrite_sentence', // Viết lại câu
            skill_focus: 'grammar',
            question_text: "Rewrite the following sentence using passive voice: 'The students finished all the homework.'",
            correct_answer_text: 'All the homework was finished by the students.',
            explanation: 'To change to passive voice, the object becomes the subject, and the verb form changes.',
            score_points: 8,
        },
        {
            question_id: 'q_006',
            question_type: 'image_description', // Mô tả hình ảnh (Từ tính năng cao cấp)
            skill_focus: 'vocabulary',
            image_url: 'https://example.com/mountain_lake.jpg', // URL của hình ảnh
            question_text: 'Describe what you see in the image below in 3-5 sentences.',
            correct_answer_keywords: ['mountain', 'lake', 'trees', 'snow', 'reflection'], // Gợi ý từ khóa cho việc chấm điểm tự động (AI có thể đánh giá mức độ bao phủ từ khóa)
            score_points: 15,
        },
        {
            question_id: 'q_007',
            question_type: 'listening_comprehension', // Nghe hiểu (Từ tính năng cao cấp)
            skill_focus: 'listening',
            audio_text:
                'Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels (like coal, oil, and gas), which produces heat-trapping gases. These gases, particularly carbon dioxide and methane, accumulate in the atmosphere and trap heat, leading to a warming planet.', // URL của file âm thanh
            question_text: 'According to the passage, what is the primary cause of climate change since the 1800s?',
            correct_answer_text: 'The main topic is about the recent economic recovery.',
            explanation: 'The speaker clearly states the focus on economic trends and recovery.',
            score_points: 10,
        },
        {
            question_id: 'q_008',
            question_type: 'reading_comprehension', // Đọc hiểu
            skill_focus: 'reading',
            passage:
                'Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, but since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels (like coal, oil, and gas), which produces heat-trapping gases. These gases, particularly carbon dioxide and methane, accumulate in the atmosphere and trap heat, leading to a warming planet.',
            question_text: 'According to the passage, what is the primary cause of climate change since the 1800s?',
            options: [
                { id: 'opt_a', text: 'Natural shifts in temperatures' },
                { id: 'opt_b', text: 'Human activities, primarily burning fossil fuels' },
                { id: 'opt_c', text: 'Volcanic eruptions' },
                { id: 'opt_d', text: 'Changes in solar radiation' },
            ],
            correct_answer_id: 'opt_b',
            explanation: "The passage explicitly states: 'since the 1800s, human activities have been the main driver of climate change, primarily due to the burning of fossil fuels'.",
            score_points: 8,
        },
    ],
}
