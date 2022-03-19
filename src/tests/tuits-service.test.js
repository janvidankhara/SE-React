import {
  createTuit,
  findAllTuits, findTuitById,
  findTuitByUser, deleteTuit
} from "../services/tuits-service";
import {
    deleteUsersByUsername,
    createUser, findUserById,
} from "../services/users-service";

describe('can create tuit with REST API', () => {
  const adam = {
      username: 'adam_smith',
      password: 'not0sum',
      email: 'wealth@nations.com'
    };
  const ripley = {
      tuit: 'good morning'
    };
    let demoUser
      // setup before running test
      beforeAll(async () => {
        // clean up before the test making sure the user doesn't already exist
        demoUser = await createUser(adam);
      });

      // clean up after ourselves
      afterAll(async() => {
        // remove any data we inserted
        deleteUsersByUsername(adam.username);
        const TuitsByUser = await findTuitByUser(demoUser._id);

        TuitsByUser.map(tid =>
              deleteTuit(tid._id)
            )

      });
      test('can post tuit by primary key of user', async () => {
          // insert the tuit in the database
          const id=demoUser._id;
          const newTuit = await createTuit(id,ripley);
          expect(newTuit.tuit).toEqual(ripley.tuit);
          expect(newTuit.postedBy).toEqual(id);
          const existingTuit = await findTuitById(newTuit._id);
          expect(existingTuit.tuit).toEqual(ripley.tuit);
          expect(existingTuit.postedBy._id).toEqual(id);
      });
});

describe('can delete tuit wtih REST API', () => {
  // sample tuit to delete
    const sowell = {
      username: 'thommas_sowell',
      password: 'compromise',
      email: 'compromise@solutions.com'
    };
    const ripley = {
          tuit: 'test delete'
    };

    let demoTuit,demoUser;
    // setup the tests before verification
    beforeAll(async() => {
      // insert the sample tuit we then try to remove
      demoUser = await createUser(sowell);
      demoTuit = await createTuit(demoUser._id, ripley);


    });

    // clean up after test runs
    afterAll(async () => {
      // remove any data we created
//      return deleteTuit(demoTuit._id);
       await deleteUsersByUsername(sowell.username);
       await deleteTuit(demoTuit._id);


    });

    test('can delete tuit from REST API by id', async () => {
      // delete a tuit by their id. Assumes tuit already exists
      const statusTuit =await deleteTuit(demoTuit._id);
      const statusUser = await deleteUsersByUsername(sowell.username);
      //verify we deleted at least one tuit by their id
      expect(statusTuit.deletedCount).toBeGreaterThanOrEqual(1);
    });
});

describe('can retrieve a tuit by their primary key with REST API', () => {
  // sample user and tuit to test on
      const sowell = {
        username: 'thommas_sowell',
        password: 'compromise',
        email: 'compromise@solutions.com'
      };
      const ripley = {
            tuit: 'test tuit by id'
      };

      let demoTuit,demoUser;
      // setup the tests before verification
      beforeAll(async() => {
        // inserted the sample user and tuit we then try to remove
        demoUser = await createUser(sowell);
        demoTuit = await createTuit(demoUser._id, ripley);


      });

      // clean up after test runs
      afterAll(async () => {
        // remove any data we created
  //      return deleteTuit(demoTuit._id);
         await deleteUsersByUsername(sowell.username);
         await deleteTuit(demoTuit._id);

      });

      test('can delete tuit from REST API by id', async () => {
        const existingTuit = await findTuitById(demoTuit._id);
        expect(existingTuit.tuit).toEqual(ripley.tuit);
        expect(existingTuit.postedBy._id).toEqual(demoUser._id);
      });
});

describe('can retrieve all tuits with REST API', () => {

    // sample users we'll insert to then retrieve
    const usernames = [
    "liam", "noah"
    ];

    //sample tuits we will insert to test data
    const tuitLiam = [
    "It's a really nice day in Boston", "Need rest before reporting to General hospital for surgery"
    ];
    const tuitNoah = [
     "celebrate the stories you love", "How is your day going"
     ];

    let demoUser=null;
    // setup data before test
    beforeAll(async() => {
    // insert several known users
        demoUser=await Promise.all(
            usernames.map(async (username) =>
            await createUser({
                              username: username,
                              password: `${username}123`,
                              email: `${username}@stooges.com`
                          }))
        );

    await Promise.all(tuitLiam.map(async (tuit) =>
          await createTuit(demoUser[0]._id,
          {
            tuit,
          })
        ));
    //create tuits for Noah
    await Promise.all(tuitNoah.map(async (tuit) =>
              await createTuit(demoUser[1]._id,
              {
                tuit,
              })
            ));
    });

    // clean up after ourselves
    afterAll(async () => {
    const TuitByLiam = await findTuitByUser(demoUser[0]._id);
    const TuitByNoah = await findTuitByUser(demoUser[1]._id);
    await Promise.all(TuitByLiam.map(async (tid) =>
            deleteTuit(tid._id)
    ));
    await Promise.all(
        TuitByNoah.map(async (tid) =>
            await deleteTuit(tid._id)
    ));
     //delete the users we inserted
    await Promise.all(
        usernames.map(async (username) =>
            await deleteUsersByUsername(username)
    ));
    });

    test('can retrieve all tuits from REST API', async () => {
        // retrieve all the tuits
        const tuits = await findAllTuits();
        // there should be a minimum number of tuits
        expect(tuits.length).toBeGreaterThanOrEqual(tuitLiam.length+tuitNoah.length);


    });
});