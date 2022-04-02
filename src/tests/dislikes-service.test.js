import {act, create} from "react-test-renderer";
import TuitStats from "../components/tuits/tuit-stats";

test('stats render correctly v1', () => {
    let dummy = {
        likes: 122,
        dislikes: 120,
        replies: 222,
        retuits: 220
    }

    const TuitLiked = () => {
        act(() => {
            dummy.likes++;
            tuitStats.update(
                <TuitStats tuit={{stats: dummy}}
                    dislikeTuit={() => {}}
                    likeTuit={() => {}}
                />)
        })
    }

    const TuitDisliked = () => {
        act(() => {
            dummy.dislikes++;
            tuitStats.update(
                <TuitStats tuit={{stats: dummy}}
                    dislikeTuit={() => {}}
                    likeTuit={() => {}}
                />)
        })
    }
    let tuitStats
    act(() => {
        tuitStats = create(
            <TuitStats
                dislikeTuit={TuitDisliked}
                likeTuit={TuitLiked}
                tuit={{stats: dummy}}/>
        );
    })

    const root = tuitStats.root;
    const likesCounter = root.findByProps({className: 'ttr-stats-likes'})
    let likesText = likesCounter.children[0];
    expect(likesText).toBe('122');
    const dislikesCounter = root.findByProps({className: 'ttr-stats-dislikes'})
    let dislikesText = dislikesCounter.children[0];
    expect(dislikesText).toBe('120');
    const likeTuitButton = root.findByProps({className: 'ttr-like-click'})
    const dislikeTuitButton = root.findByProps({className: 'ttr-dislike-click'})
    const retuitsCounter = root.findByProps({className: 'ttr-stats-retuits'})
    const retuitsText = retuitsCounter.children[0];
    expect(retuitsText).toBe('220');
    const repliesCounter = root.findByProps({className: 'ttr-stats-replies'})
    const repliesText = repliesCounter.children[0];
    expect(repliesText).toBe('222');

    act(() => {dislikeTuitButton.props.onClick()})
    dislikesText = dislikesCounter.children[0];
    expect(dislikesText).toBe('121');
});