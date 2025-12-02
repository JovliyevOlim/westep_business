import AddLesson from "./AddLesson.tsx";
import {Route, Routes} from "react-router";

function LessonDetails() {
    return (
        <div>
            <Routes>
                <Route
                    path={'updateLesson/:lessonId'}
                    element={<AddLesson/>}
                />
                <Route
                    path={'addLesson'}
                    element={<AddLesson/>}
                />
            </Routes>
        </div>
    );
}

export default LessonDetails;